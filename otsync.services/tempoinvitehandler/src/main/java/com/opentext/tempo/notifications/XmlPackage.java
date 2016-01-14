package com.opentext.tempo.notifications;

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
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class XmlPackage {

    private Document doc = null;
    private Element root = null;
    private String defaultRootTag = "tempoinvite"; 

    public XmlPackage() throws ParserConfigurationException {
        createDocument(defaultRootTag);
    }

    public Element getRoot() {
        return root;
    }

    public Element addElement(Element e, String tagName) {
        Element retval = doc.createElement(tagName);
        e.appendChild(retval);
        return retval;
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

    public XmlPackage(String tagName) throws ParserConfigurationException {
        createDocument(tagName);
    }

    private void createDocument(String tagName) throws ParserConfigurationException {
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = builderFactory.newDocumentBuilder();
        doc = docBuilder.newDocument();
        root = doc.createElement(tagName);
        doc.appendChild(root);
    }

    public void addResultSet(Element e, ResultSet rs, String tagName) throws SQLException {
        int col;
        ResultSetMetaData rsmd = rs.getMetaData();
        int numberOfColumns = rsmd.getColumnCount();
        int[] columnTypes = new int[numberOfColumns];
        String[] columnNames = new String[numberOfColumns];
        for (col = 1; col <= numberOfColumns; col++) {
            columnTypes[col - 1] = rsmd.getColumnType(col);
            columnNames[col - 1] = rsmd.getColumnLabel(col);
        }

        while (rs.next()) {
            Element newElement = doc.createElement(tagName);
            for (col = 1; col <= numberOfColumns; col++) {
                switch (columnTypes[col - 1]) {
                    case java.sql.Types.VARCHAR:
                    case java.sql.Types.LONGNVARCHAR:
                    case java.sql.Types.LONGVARCHAR:
                    case java.sql.Types.NVARCHAR: {
                        newElement.setAttribute(columnNames[col - 1], rs.getString(col));
                    }
                    break;
                    case java.sql.Types.BIGINT: {
                        newElement.setAttribute(columnNames[col - 1], Long.toString(rs.getLong(col)));
                    }
                    break;
                    case java.sql.Types.BIT:
                    case java.sql.Types.INTEGER:
                    case java.sql.Types.SMALLINT:
                    case java.sql.Types.TINYINT: {
                        newElement.setAttribute(columnNames[col - 1], Integer.toString(rs.getInt(col)));
                    }
                    break;
                }
            }
            e.appendChild(newElement);
        }
    }
}

