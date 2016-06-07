package com.opentext.tempo.external.invites.handler;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;

public class XmlPackage {

    private static final String DEFAULT_ROOT_TAG = "tempoinvite";

    private Document doc = null;
    private Element root = null;

    public XmlPackage() throws ParserConfigurationException {
        createDocument(DEFAULT_ROOT_TAG);
    }

    public Element getRoot() {
        return root;
    }

    public Element addElement(Element e, String tagName) {
        Element retVal = doc.createElement(tagName);
        e.appendChild(retVal);
        return retVal;
    }

    public void write(Writer out, String xslPath, InputStream xsl) throws IOException, TransformerException {
        StreamSource source = new StreamSource(xsl);
        source.setSystemId(xslPath);
        write(out, source);
    }

    public void write(Writer out, Source xsl) throws IOException, TransformerException {
        DOMSource source = new DOMSource(doc);
        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer(xsl);
        StreamResult result = new StreamResult(out);
        transformer.transform(source, result);
    }

    public void write(Writer out) throws IOException, TransformerException {
        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
        DOMSource source = new DOMSource(doc);
        StreamResult result = new StreamResult(out);
        transformer.transform(source, result);
    }

    private void createDocument(String tagName) throws ParserConfigurationException {
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = builderFactory.newDocumentBuilder();
        doc = docBuilder.newDocument();
        root = doc.createElement(tagName);
        doc.appendChild(root);
    }

}

