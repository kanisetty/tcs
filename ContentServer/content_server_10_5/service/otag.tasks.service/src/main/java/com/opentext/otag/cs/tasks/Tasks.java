package com.opentext.otag.cs.tasks;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("tasks")
@Produces(MediaType.APPLICATION_JSON)
public class Tasks {

    private static final Log LOG = LogFactory.getLog(Tasks.class);

    private static final String TASK_FUNC = "otag.tasksGet";
    private static final String TASK_PUT_FUNC = "otag.tasksPost";

    private static TasksService tasksService;

    @GET
    @Path("{taskID}")
    public StreamingOutput getTask(@QueryParam("cstoken") String cstoken,
                                   @CookieParam("LLCookie") String llcookie,
                                   @PathParam("taskID") String taskID,
                                   @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        return getTaskItem(taskID, cstoken, request);
    }

    @PUT
    @Path("{taskID}")
    public StreamingOutput updateTask(@QueryParam("cstoken") String cstoken,
                                      @CookieParam("LLCookie") String llcookie,
                                      @QueryParam("name") String name,
                                      @QueryParam("assignedTo") String assignedTo,
                                      @QueryParam("comments") String comments,
                                      @QueryParam("dueDate") String dueDate,
                                      @QueryParam("instructions") String instructions,
                                      @QueryParam("priority") String priority,
                                      @QueryParam("startDate") String startDate,
                                      @QueryParam("status") String status,
                                      @PathParam("taskID") String taskID,
                                      @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;

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

        return new CSRequest(getCsUrl(), TASK_PUT_FUNC,
                cstoken, params, new ForwardHeaders(request));
    }

    private StreamingOutput getTaskItem(String taskID, String cstoken, HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("taskID", taskID));
        return new CSRequest(getCsUrl(), TASK_FUNC,
                cstoken, params, new ForwardHeaders(request));
    }

    private String getCsUrl() {
        // resolve the parent service lazily
        if (tasksService == null)
            tasksService = AppworksComponentContext.getComponent(TasksService.class);

        if (tasksService == null) {
            LOG.error("Unable to resolve TasksService");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        String csUrl = tasksService.getCsConnection();
        if (csUrl == null || csUrl.isEmpty()) {
            LOG.error("Unable to resolve Content Server connection, all requests will be rejected");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        return csUrl;
    }

}
