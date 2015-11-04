package com.opentext.otsync.tasks.rest;

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

@Path("tasks")
@Produces(MediaType.APPLICATION_JSON)
public class Tasks {

    private static final String TASK_FUNC = "otag.tasksGet";
    private static final String TASK_PUT_FUNC = "otag.tasksPost";

    @GET
    @Path("{taskID}")
    public StreamingOutput getTask(@PathParam("taskID") String taskID,
                                   @Context HttpServletRequest request) {

        return getTaskItem(taskID, request);
    }

    @PUT
    @Path("{taskID}")
    public StreamingOutput updateTask(@QueryParam("name") String name,
                                      @QueryParam("assignedTo") String assignedTo,
                                      @QueryParam("comments") String comments,
                                      @QueryParam("dueDate") String dueDate,
                                      @QueryParam("instructions") String instructions,
                                      @QueryParam("priority") String priority,
                                      @QueryParam("startDate") String startDate,
                                      @QueryParam("status") String status,
                                      @PathParam("taskID") String taskID,
                                      @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>();
        if (taskID != null)
            params.add(new BasicNameValuePair("taskID", taskID));
        if (name != null)
            params.add(new BasicNameValuePair("name", name));
        if (assignedTo != null)
            params.add(new BasicNameValuePair("assignedTo", assignedTo));
        if (comments != null)
            params.add(new BasicNameValuePair("comments", comments));
        if (dueDate != null)
            params.add(new BasicNameValuePair("dueDate", dueDate));
        if (instructions != null)
            params.add(new BasicNameValuePair("instructions", instructions));
        if (priority != null)
            params.add(new BasicNameValuePair("priority", priority));
        if (startDate != null)
            params.add(new BasicNameValuePair("startDate", startDate));
        if (status != null)
            params.add(new BasicNameValuePair("status", status));

        return new CSRequest(TasksService.getCsUrl(), TASK_PUT_FUNC, params, new CSForwardHeaders(request));
    }

    private StreamingOutput getTaskItem(String taskID, HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("taskID", taskID));
        return new CSRequest(TasksService.getCsUrl(), TASK_FUNC, params, new CSForwardHeaders(request));
    }
}
