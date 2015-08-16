package com.opentext.otag.cs.workflow;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;
import com.opentext.otag.rest.util.ForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("workflows")
@Produces(MediaType.APPLICATION_JSON)
public class Workflows {

    @GET
    @Path("{mapID}")
    public StreamingOutput getWorkflow(@QueryParam("cstoken") String cstoken,
                                       @CookieParam("LLCookie") String llcookie,
                                       @PathParam("mapID") String mapID,
                                       @QueryParam("nextUrl") String nextUrl,
                                       @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("nodeID", mapID));
        params.add(new BasicNameValuePair("nextUrl", nextUrl));
        return new CSRequest(getCsUrl(), "otag.workflowget", cstoken, params, new ForwardHeaders(request));
    }

    @POST
    @Path("{mapID}")
    public StreamingOutput initiateWorkflow(@FormParam("cstoken") String cstoken,
                                            @CookieParam("LLCookie") String llcookie,
                                            @PathParam("mapID") String mapID,
                                            @FormParam("title") String title,
                                            @FormParam("comment") String comment,
                                            @FormParam("atts") String atts,
                                            @FormParam("dueDate") String dueDate,
                                            @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("nodeID", mapID));
        if (comment != null)
            params.add(new BasicNameValuePair("comment", comment));
        if (title != null)
            params.add(new BasicNameValuePair("title", title));
        if (atts != null)
            params.add(new BasicNameValuePair("atts", atts));
        if (dueDate != null)
            params.add(new BasicNameValuePair("dueDate", dueDate));
        return new CSRequest(getCsUrl(), "otag.workflowinit", cstoken, params, new ForwardHeaders(request));
    }

    @GET
    @Path("{workID}/tasks/{taskID}")
    public StreamingOutput getWorkflowStep(@QueryParam("cstoken") String cstoken,
                                           @CookieParam("LLCookie") String llcookie,
                                           @PathParam("workID") String workID,
                                           @PathParam("taskID") String taskID,
                                           @QueryParam("stepDoneUrl") String stepDoneUrl,
                                           @QueryParam("formDoneUrl") String formDoneUrl,
                                           @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;
        return getStep(workID, workID, taskID, stepDoneUrl, formDoneUrl, cstoken, request);
    }

    @GET
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput getSubworkflowStep(@QueryParam("cstoken") String cstoken,
                                              @CookieParam("LLCookie") String llcookie,
                                              @PathParam("workID") String workID,
                                              @PathParam("subworkID") String subworkID,
                                              @PathParam("taskID") String taskID,
                                              @QueryParam("stepDoneUrl") String stepDoneUrl,
                                              @QueryParam("formDoneUrl") String formDoneUrl,
                                              @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;

        return getStep(workID, subworkID, taskID, stepDoneUrl, formDoneUrl, cstoken, request);
    }

    private StreamingOutput getStep(String workID, String subworkID, String taskID,
                                    String stepDoneUrl, String formDoneUrl, String cstoken,
                                    HttpServletRequest request) {
        List<NameValuePair> params = new ArrayList<>(7);
        params.add(new BasicNameValuePair("workID", workID));
        params.add(new BasicNameValuePair("subworkID", subworkID));
        params.add(new BasicNameValuePair("taskID", taskID));
        params.add(new BasicNameValuePair("stepDoneUrl", stepDoneUrl));
        params.add(new BasicNameValuePair("formDoneUrl", formDoneUrl));
        return new CSRequest(getCsUrl(), "otag.workflowstepget", cstoken, params, new ForwardHeaders(request));
    }

    @PUT
    @Path("{workID}/tasks/{taskID}")
    public StreamingOutput sendWorkflowStepOn(@QueryParam("cstoken") String cstoken,
                                              @CookieParam("LLCookie") String llcookie,
                                              @PathParam("workID") String workID,
                                              @PathParam("taskID") String taskID,
                                              @QueryParam("comment") String comment,
                                              @QueryParam("disposition") String disposition,
                                              @QueryParam("atts") String atts,
                                              @QueryParam("xAction") String xAction,
                                              @QueryParam("userID") String userID,
                                              @QueryParam("instructions") String instructions,
                                              @QueryParam("duration") String duration,
                                              @QueryParam("stepName") String stepName,
                                              @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        return putStep(cstoken, workID, workID, taskID, comment,
                disposition, atts, request, userID, xAction,
                instructions, duration, stepName);
    }

    @PUT
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput sendSubworkflowStepOn(@QueryParam("cstoken") String cstoken,
                                                 @CookieParam("LLCookie") String llcookie,
                                                 @PathParam("workID") String workID,
                                                 @PathParam("subworkID") String subworkID,
                                                 @PathParam("taskID") String taskID,
                                                 @QueryParam("comment") String comment,
                                                 @QueryParam("disposition") String disposition,
                                                 @QueryParam("atts") String atts,
                                                 @QueryParam("xAction") String xAction,
                                                 @QueryParam("userID") String userID,
                                                 @QueryParam("instructions") String instructions,
                                                 @QueryParam("duration") String duration,
                                                 @QueryParam("stepName") String stepName,
                                                 @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        return putStep(cstoken, workID, subworkID, taskID, comment,
                disposition, atts, request, userID, xAction,
                instructions, duration, stepName);
    }

    @POST
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput acceptAssignment(@QueryParam("cstoken") String cstoken,
                                            @CookieParam("LLCookie") String llcookie,
                                            @PathParam("workID") String workID,
                                            @PathParam("subworkID") String subworkID,
                                            @PathParam("taskID") String taskID,
                                            @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("workID", workID));
        params.add(new BasicNameValuePair("subworkID", subworkID));
        params.add(new BasicNameValuePair("taskID", taskID));

        return new CSRequest(getCsUrl(), "otag.assignmentaccept", cstoken, params, new ForwardHeaders(request));
    }

    private StreamingOutput putStep(String cstoken, String workID,
                                    String subworkID, String taskID, String comment,
                                    String disposition, String atts, HttpServletRequest request,
                                    String userID, String xAction, String instructions,
                                    String duration, String stepName) {
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("workID", workID));
        params.add(new BasicNameValuePair("subworkID", subworkID));
        params.add(new BasicNameValuePair("taskID", taskID));
        if (comment != null)
            params.add(new BasicNameValuePair("comment", comment));
        if (disposition != null)
            params.add(new BasicNameValuePair("disposition", disposition));
        if (atts != null)
            params.add(new BasicNameValuePair("atts", atts));
        if (userID != null)
            params.add(new BasicNameValuePair("userID", userID));
        if (xAction != null)
            params.add(new BasicNameValuePair("xAction", xAction));
        if (instructions != null)
            params.add(new BasicNameValuePair("instructions", instructions));
        if (duration != null)
            params.add(new BasicNameValuePair("duration", duration));
        if (stepName != null)
            params.add(new BasicNameValuePair("stepName", stepName));

        return new CSRequest(getCsUrl(), "otag.workflowstepput", cstoken, params, new ForwardHeaders(request));
    }

    public String getCsUrl() {
        return ContentServerAppworksServiceBase.getCsUrl();
    }

}
