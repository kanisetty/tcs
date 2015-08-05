package com.opentext.otag.cluster.poc;

import org.apache.catalina.tribes.*;
import org.apache.catalina.tribes.group.GroupChannel;
import org.apache.catalina.tribes.group.RpcChannel;
import org.apache.catalina.tribes.group.RpcMessage;
import org.apache.catalina.tribes.io.XByteBuffer;
import org.apache.catalina.tribes.util.Logs;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Serializable;

/**
 * Awg implementation of Apache Tribes org.apache.catalina.tribes.group.GroupChannel
 * we have fixed the messageRecieved method so that is provides a decent set of
 * Classloaders for the deserialization of messages. Absurd really.
 */
public class AwgGroupChannel extends GroupChannel {

    private static final Log LOG = LogFactory.getLog(AwgGroupChannel.class);

    @Override
    public void messageReceived(ChannelMessage msg) {
        if (msg == null)
            return;

        try {
            if (LOG.isTraceEnabled()) {
                LOG.trace("GroupChannel - Received msg:" +
                        new UniqueId(msg.getUniqueId()) + " at " +
                        new java.sql.Timestamp(System.currentTimeMillis()) + " from " +
                        msg.getAddress().getName());
            }

            Serializable fwd;
            if ((msg.getOptions() & SEND_OPTIONS_BYTE_MESSAGE) == SEND_OPTIONS_BYTE_MESSAGE) {
                fwd = new ByteMessage(msg.getMessage().getBytes());
            } else {
                try {
                    fwd = XByteBuffer.deserialize(msg.getMessage().getBytesDirect(), 0,
                            msg.getMessage().getLength(), getClassLoaders());
                }catch (Exception sx) {
                    LOG.error(sm.getString("groupChannel.unable.deserialize", msg), sx);
                    return;
                }
            }

            if (Logs.MESSAGES.isTraceEnabled() ) {
                LOG.debug("GroupChannel - Receive Message:" +
                        new UniqueId(msg.getUniqueId()) + " is " + fwd);
            }

            //get the actual member with the correct alive time
            Member source = msg.getAddress();
            boolean rx = false;
            boolean delivered = false;
            for (int i = 0; i < channelListeners.size(); i++) {
                ChannelListener channelListener = (ChannelListener) channelListeners.get(i);
                if (channelListener != null && channelListener.accept(fwd, source)) {
                    channelListener.messageReceived(fwd, source);
                    delivered = true;
                    //if the message was accepted by an RPC channel, that channel
                    //is responsible for returning the reply, otherwise we send an absence reply
                    if (channelListener instanceof RpcChannel)
                        rx = true;
                }
            }

            if (!rx && (fwd instanceof RpcMessage)) {
                //if we have a message that requires a response,
                //but none was given, send back an immediate one
                sendNoRpcChannelReply((RpcMessage)fwd,source);
            }

            if (LOG.isTraceEnabled() ) {
                LOG.trace("GroupChannel delivered[" + delivered + "] id:" +
                        new UniqueId(msg.getUniqueId()));
            }

        } catch (Exception e) {
            //this could be the channel listener throwing an exception, we should log it
            //as a warning.
            LOG.warn(sm.getString("groupChannel.receiving.error"), e);
            throw new RemoteProcessException("Exception:"+ e.getMessage(),e);
        }
    }

    /**
     * Get the classloaders that are available.
     *
     * @return classloader array
     */
    private ClassLoader[] getClassLoaders() {
        return new ClassLoader[] {
                Thread.currentThread().getContextClassLoader(),
                getClass().getClassLoader(),
                ClassLoader.getSystemClassLoader()
        };
    }

}
