### Document Conversion Service (DCS)

## Description

The DCS houses a conversion engine .exe capable of reading a document and producing images for each page of that document.
This service takes documents from Content Server, processes them locally with the conversion engine, caches the result locally and uploads them back to Content Server.
An API is exposed to trigger conversions, and access the results that were uploaded to Content Server.

## REST interface

There are 2 HTTP endpoints

- `GET` /dcs/nodes/{nodeID} -> application/json
- `GET` /dcs/nodes/{nodeID}/pages/{page} -> image/png

# `GET` /dcs/nodes/{nodeID}
The response from the first call doesn’t really return a JSON object, just a number representing the number of pages. What it does is however is check to see if there are any “pages” stored in CS for the document represented by the node to see if a conversion has occurred. If it hasn’t yet the service will do so. 

This entails downloading the latest version of the document from CS, throwing it at the conversion service exe, which then spits the pages out as pngs to a folder with the Gateway. 

These are then uploaded back to content server for individual page access (the second endpoint).

# `GET` /dcs/nodes/{nodeID}/pages/{page}
This call simply routes through to content server, asking for a page via the "otag.renderedpageget" cs function. 
Just like the other call, if cs tells us it doesn’t know about the page it will perform the conversion routine (download latest, convert, store, upload), and then make the getPage call again and cs should now have it.
