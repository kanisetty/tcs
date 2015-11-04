package com.opentext.otag.cs.workflow;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.rest.util.CSForwardHeaders;
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
public class WorkflowsResource {

    @GET
    @Path("{mapID}")
    public StreamingOutput getWorkflow(@PathParam("mapID") String mapID,
                                       @QueryParam("nextUrl") String nextUrl,
                                       @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("nodeID", mapID));
        params.add(new BasicNameValuePair("nextUrl", nextUrl));
        return new CSRequest(WorkflowAppworksService.getCsUrl(), "otag.workflowget", params,
                new CSForwardHeaders(request));
    }

    @POST
    @Path("{mapID}")
    public StreamingOutput initiateWorkflow(@PathParam("mapID") String mapID,
                                            @FormParam("title") String title,
                                            @FormParam("comment") String comment,
                                            @FormParam("atts") String atts,
                                            @FormParam("dueDate") String dueDate,
                                            @Context HttpServletRequest request) {

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
        return new CSRequest(WorkflowAppworksService.getCsUrl(), "otag.workflowinit", params,
                                new CSForwardHeaders(request));
    }

    @GET
    @Path("{workID}/tasks/{taskID}")
    public StreamingOutput getWorkflowStep(@PathParam("workID") String workID,
                                           @PathParam("taskID") String taskID,
                                           @QueryParam("stepDoneUrl") String stepDoneUrl,
                                           @QueryParam("formDoneUrl") String formDoneUrl,
                                           @Context HttpServletRequest request) {

        return getStep(workID, workID, taskID, stepDoneUrl, formDoneUrl, request);
    }

    @GET
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput getSubworkflowStep(@PathParam("workID") String workID,
                                              @PathParam("subworkID") String subworkID,
                                              @PathParam("taskID") String taskID,
                                              @QueryParam("stepDoneUrl") String stepDoneUrl,
                                              @QueryParam("formDoneUrl") String formDoneUrl,
                                              @Context HttpServletRequest request) {

        return getStep(workID, subworkID, taskID, stepDoneUrl, formDoneUrl, request);
    }

    private StreamingOutput getStep(String workID, String subworkID, String taskID,
                                    String stepDoneUrl, String formDoneUrl, HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(7);
        params.add(new BasicNameValuePair("workID", workID));
        params.add(new BasicNameValuePair("subworkID", subworkID));
        params.add(new BasicNameValuePair("taskID", taskID));
        params.add(new BasicNameValuePair("stepDoneUrl", stepDoneUrl));
        params.add(new BasicNameValuePair("formDoneUrl", formDoneUrl));
        return new CSRequest(WorkflowAppworksService.getCsUrl(), "otag.workflowstepget", params,
                                new CSForwardHeaders(request));
    }

    @PUT
    @Path("{workID}/tasks/{taskID}")
    public StreamingOutput sendWorkflowStepOn(@PathParam("workID") String workID,
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

        return putStep(workID, workID, taskID, comment, disposition, atts, request, userID, xAction,
                        instructions, duration, stepName);
    }

    @PUT
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput sendSubworkflowStepOn(@PathParam("workID") String workID,
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

        return putStep(workID, subworkID, taskID, comment,
                disposition, atts, request, userID, xAction,
                instructions, duration, stepName);
    }

    @POST
    @Path("{workID}/subwork/{subworkID}/tasks/{taskID}")
    public StreamingOutput acceptAssignment(@PathParam("workID") String workID,
                                            @PathParam("subworkID") String subworkID,
                                            @PathParam("taskID") String taskID,
                                            @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("workID", workID));
        params.add(new BasicNameValuePair("subworkID", subworkID));
        params.add(new BasicNameValuePair("taskID", taskID));

        return new CSRequest(WorkflowAppworksService.getCsUrl(), "otag.assignmentaccept", params,
                                new CSForwardHeaders(request));
    }

    private StreamingOutput putStep(String workID, String subworkID, String taskID, String comment,
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

        return new CSRequest(WorkflowAppworksService.getCsUrl(), "otag.workflowstepput", params,
                                new CSForwardHeaders(request));
    }
}
