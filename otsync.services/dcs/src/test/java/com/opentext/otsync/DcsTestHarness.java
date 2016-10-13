package com.opentext.otsync;

import org.apache.http.HttpEntity;
import org.apache.http.client.CookieStore;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.junit.Assert.fail;

/**
 * Test harness to request all the pages of a document hosted by the DCS service, we get the
 * total number of pages via the DCS API and then download each page to a local area on disk.
 *
 * !!!PLEASE PROVIDE YOUR OWN VALUES FOR THE CONSTANTS BELOW!!!
 */
@Ignore
public class DcsTestHarness {

    private static final String OTAGTOKEN = "otagtoken";
    private static final String OTDSTICKET = "otdsticket";

    private static final String CONTENT_TYPE_HEADER = "Content-Type";
    private static final String APPLICATION_JSON = "application/json";

    // windows sorry :(
    private static final String TEST_OUTPUT_DIR = "C:/DCS";
    private static final Stream<String> TEST_DOCS = Stream.of("45033", "45033", "45033", "45033");

    private static final String GATEWAY_URL = "http://???:8080";

    private static final String USERNAME = "???";
    private static final String PASSWORD = "???";

    private static CloseableHttpClient closeableHttpClient;

    @BeforeClass
    public static void beforeTests() {
        closeableHttpClient = getHttpClient();
    }

    @Test
    public void getDcsDoc() throws Exception {
        String gatewayBaseUrl = GATEWAY_URL;

        String loginUrl = gatewayBaseUrl + "/v3/admin/auth";
        String loginBody =
                "{" +
                        "\"userName\":\"" + USERNAME + "\"," +
                        "\"password\":\"" + PASSWORD + "\"," +
                        "\"clientData\":" +
                        "{\"clientId\":\"" + UUID.randomUUID().toString() + "\"," +
                        "\"clientInfo\":{\"type\":\"web\",\"app\":\"admin-ui\",\"runtime\":\"otagadmin\"}" +
                        "}" +
                        "}";

        HttpPost loginRequestPost = new HttpPost(loginUrl);
        loginRequestPost.setHeader(CONTENT_TYPE_HEADER, APPLICATION_JSON);

        StringEntity jsonEntity = new StringEntity(loginBody, Charset.forName("UTF-8"));
        loginRequestPost.setEntity(jsonEntity);

        HttpClientContext context = HttpClientContext.create();
        try (CloseableHttpResponse loginResp = closeableHttpClient.execute(loginRequestPost, context)) {
            int statusCode = loginResp.getStatusLine().getStatusCode();
            if (statusCode != 200)
                throw new RuntimeException("Failed to login - status " + statusCode);
            CookieStore cookieStore = context.getCookieStore();
            List<Cookie> cookies = cookieStore.getCookies();

            String otagToken = cookies.stream()
                    .filter(cookie -> cookie.getName().equals(OTAGTOKEN)).findFirst().map(Cookie::getValue)
                    .orElseThrow(() ->  new RuntimeException("Could not find otag token in login response"));

            String otdsTicket = cookies.stream()
                    .filter(cookie -> cookie.getName().equals(OTDSTICKET)).findFirst().map(Cookie::getValue)
                    .orElseThrow(() ->  new RuntimeException("Could not find OTDS ticket in login response"));

            String body = EntityUtils.toString(loginResp.getEntity());
            System.out.println("Auth response body: " + body);

            // and the otcs -> LLCookie
            String llCookie = new JSONObject(body)
                    .getJSONObject("addtl")
                    .getJSONObject("otsync-connector")
                    .getString("otcsticket");

            TEST_DOCS.forEach(node ->
                    doGetTest(node, gatewayBaseUrl, otagToken, otdsTicket, llCookie));
        }
    }

    private void doGetTest(String nodeId, String gatewayBaseUrl,
                           String otagToken, String otdsTicket, String llCookie) {
        if (otagToken != null && otdsTicket != null && llCookie != null) {
            String dcsUrl = getDcsUrl(gatewayBaseUrl, nodeId);

            HttpGet getTotalPages = formGetRequest(otagToken, otdsTicket, llCookie, dcsUrl);
            int pages = 0;

            try {
                // we need to get the page count first
                pages = 0;
                try (CloseableHttpResponse totalPagesResponse = closeableHttpClient.execute(getTotalPages)) {
                    String totalPages = EntityUtils.toString(totalPagesResponse.getEntity());
                    try {
                        pages = Integer.valueOf(totalPages);
                    } catch (NumberFormatException e) {
                        fail("Invalid number of pages returned for node " + nodeId);
                    }
                }
            } catch (IOException e) {
                fail("Failed to execute get rendered page call");
                e.printStackTrace();
            }

            String outputPath = TEST_OUTPUT_DIR + File.separator + nodeId;

            try {
                if (!Files.exists(Paths.get(outputPath)))
                    Files.createDirectory(Paths.get(outputPath));
            } catch (IOException e) {
                fail("Could not create rendered page output for node " + nodeId);
            }

            // then we can grab the rendered pages
            int pageCounter = 1;
            while (pageCounter <= pages) {
                try {
                    HttpGet getPage = formGetRequest(otagToken, otdsTicket, llCookie, dcsUrl + "/pages/" + pageCounter);
                    try (CloseableHttpResponse getPageNResponse = closeableHttpClient.execute(getPage)) {
                        System.out.println("Node " + nodeId + " page (" + pageCounter + ") - " +
                                "status=" + getPageNResponse.getStatusLine().getStatusCode());

                        String pagePath = outputPath + File.separator + "page" + pageCounter + ".png";

                        HttpEntity responseEntity = getPageNResponse.getEntity();
                        // dump pngs to disk
                        BufferedInputStream bis = new BufferedInputStream(responseEntity.getContent());
                        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(pagePath)));
                        int inByte;
                        while ((inByte = bis.read()) != -1) bos.write(inByte);
                        bis.close();
                        bos.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    pageCounter++;
                }
            }
        } else {
            fail("We needed an otagtoken an otds ticket to call DCS");
        }
    }

    private HttpGet formGetRequest(String otagToken, String otdsTicket, String llCookie, String dcsUrl) {
        HttpGet getTotalPages = new HttpGet(dcsUrl);

        getTotalPages.setHeader(OTAGTOKEN, otagToken);
        getTotalPages.setHeader("Cookie", "otdsticket=" + otdsTicket + "; " +
                "otagtoken=" + otagToken + "; " +
                "LLCookie=" + llCookie);
        return getTotalPages;
    }

    private String getDcsUrl(String gatewayBaseUrl, String nodeId) {
        return gatewayBaseUrl + "/dcs/v5/nodes/" + nodeId;
    }

    private static CloseableHttpClient getHttpClient() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager(5, TimeUnit.SECONDS);
        cm.setMaxTotal(5);
        cm.setDefaultMaxPerRoute(2);

        int millisVal = 5000;
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(millisVal)
                .setConnectionRequestTimeout(millisVal)
                .setSocketTimeout(millisVal)
                .build();

        return HttpClients.custom()
                .setConnectionManager(cm)
                .setDefaultRequestConfig(requestConfig)
                .build();
    }

}
