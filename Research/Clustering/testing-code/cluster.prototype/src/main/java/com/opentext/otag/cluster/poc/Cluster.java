package com.opentext.otag.cluster.poc;

import org.apache.catalina.tribes.*;
import org.apache.catalina.tribes.group.GroupChannel;
import org.apache.catalina.tribes.group.interceptors.MessageDispatch15Interceptor;
import org.apache.catalina.tribes.group.interceptors.TcpFailureDetector;
import org.apache.catalina.tribes.membership.McastService;
import org.apache.catalina.tribes.transport.ReceiverBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;

// Cluster singleton
public class Cluster implements ChannelListener, MembershipListener {

    private static final Log LOG = LogFactory.getLog(Cluster.class);

    public static final int CLUSTER_RECEIVER_PORT = 4000;
    public static final String CLUSTER_RECEIVER_ADDRESS = "auto";
    public static final int CLUSTER_FREQUENCY = 1000;

    public static final String OTAG_CLUSTER_KEY = "AWG-CLUSTER-KEY";

    private GroupChannel channel;
    private int sendOptions;

    private boolean isStarted = false;

    // singleton
    private static Cluster instance;

    public static Cluster getInstance() {
        if (instance == null)
            instance = new Cluster();

        return instance;
    }

    public void start() {
        getInstance();
    }

    public void stop() throws ChannelException {
        channel.stop(Channel.DEFAULT);
    }

    private Cluster() {
        try {
            channel = new AwgGroupChannel();

            McastService membershipService = (McastService) channel.getMembershipService();
            ReceiverBase receiver = (ReceiverBase) channel.getChannelReceiver();

            channel.addChannelListener(this);
            channel.addMembershipListener(this);

            String clusterKey = getClusterKey();
            LOG.info("clusterKey=" + clusterKey);
            int clusterMulticastPort = getClusterMulticastPort();
            LOG.info("clusterMulticastPort=" + clusterMulticastPort);
            String clusterMulticastAddress = getClusterMulticastAddress();
            LOG.info("clusterMulticastAddress=" + clusterMulticastAddress);

            // standard apache interceptors: better availability detection, and use separate thread to send messages
            channel.addInterceptor(new ClusterEncryptionInterceptor(clusterKey));
            channel.addInterceptor(new TcpFailureDetector());
            channel.addInterceptor(new MessageDispatch15Interceptor());

            // set multi-cast (member discovery) parameters
            membershipService.setPort(clusterMulticastPort);
            membershipService.setAddress(clusterMulticastAddress);
            membershipService.setFrequency(CLUSTER_FREQUENCY);

            // set receiver (incoming message) parameters
            receiver.setAddress(CLUSTER_RECEIVER_ADDRESS);
            receiver.setPort(CLUSTER_RECEIVER_PORT);

            sendOptions = Channel.SEND_OPTIONS_DEFAULT;


            channel.start(Channel.DEFAULT);

            isStarted = true;
        } catch (ChannelException e) {
            String message = "Failed to create Cluster " + e.getMessage();
            LOG.error(message, e);
            throw new RuntimeException(message, e);
        }
    }

    public void send(ClusterMessage toSend) {
        if(channel == null)
            throw new IllegalStateException("Channel was null when we were asked to send???");

        try {
            Member[] members = channel.getMembers();

            new ArrayList<>(Arrays.asList(members)).stream().forEach(member -> {
                LOG.info("We have a friend - " + member.getName() + ": "
                        + Arrays.toString(member.getHost()) + " : " + member.toString());
            });

            int nodes = members.length;
            if (nodes > 0) {
                LOG.info("Sending message " + toSend.toString() + " to " +
                        nodes + " friends");
                channel.send(members, toSend, sendOptions);
            } else {
                LOG.warn("Cluster members was empty, I have no friends???");
            }
        } catch (ChannelException e) {
            LOG.error("Problem broadcasting event: " + toSend.toString(), e);
        }
    }

    @Override
    public void messageReceived(Serializable msg, Member sender) {
        LOG.info("OnMessageReceived");
        if (!isStarted)
            throw new IllegalStateException("onMessageReceived: We aren't started yet????");

        if (msg instanceof ClusterMessage) {
            LOG.info("YAY WE GOT A MESSAGE " + msg.toString());
        } else {
            LOG.error("!!!!!!!!!!!!!!!! message received wasn't a ClusterMessage instance????? !!!!!!!!!!!!!!!!");
        }
    }

    @Override
    public boolean accept(Serializable msg, Member sender) {
        LOG.info("accept: started=" + isStarted);
        return isStarted;
    }

    @Override
    public void memberAdded(Member member) {
        LOG.info("Member added to cluster " + member.getName() + ": "
                + Arrays.toString(member.getHost()) + " : " + member.toString());
    }

    @Override
    public void memberDisappeared(Member member) {
        LOG.info("Member removed from cluster " + member.getName() + ": "
                + Arrays.toString(member.getHost()) + " : " + member.toString());
    }

    public String getClusterKey() {
        return OTAG_CLUSTER_KEY;
    }

    private String getClusterMulticastAddress() {
        int hash = getClusterKey().hashCode();
        int hiBits = (hash & 0xfc000000) >>> 26; // highest 6 bits
        int midBits = (hash & 0x3fc0000) >>> 18; // next 8 bits
        int loBits = (hash & 0x3fc00) >>> 10; // next 8 bits
        String addr = "229." + hiBits + "." + midBits + "." + loBits;
        LOG.info("Calculated multicast address from cluster id as " + addr);
        return addr;
    }

    private int getClusterMulticastPort() {
        int hash = getClusterKey().hashCode();
        int portBits = hash & 0x3ff; // lowest 10 bits
        int port = 47000 + portBits;
        LOG.info("Calculated multi-cast port from cluster id as " + port);
        return port;
    }
}
