package com.opentext.otag.cluster.poc;

import org.apache.catalina.tribes.ChannelException;
import org.apache.catalina.tribes.ChannelMessage;
import org.apache.catalina.tribes.Member;
import org.apache.catalina.tribes.group.ChannelInterceptorBase;
import org.apache.catalina.tribes.group.InterceptorPayload;
import org.apache.catalina.tribes.io.XByteBuffer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HashMap;

public class ClusterEncryptionInterceptor extends ChannelInterceptorBase {

    public static final Log LOG = LogFactory.getLog(ClusterEncryptionInterceptor.class);

    private static final String IV = "iv";
    private static final String DATA_KEY = "data";

    private final Cipher decryptor;
    private final Cipher encryptor;
    private SecretKeySpec key;

    public ClusterEncryptionInterceptor(String clusterKey) {
        Cipher decryptor = null;
        Cipher encryptor = null;

        try {
            // convert shared key to 128-bit encryption key
            // NB: MD5 is not considered secure, but is used here *only* as a predictable way
            // to convert an arbitrary shared key into a 128-bit key.
            MessageDigest digest = MessageDigest.getInstance("MD5");
            byte[] keyBytes = digest.digest(clusterKey.getBytes());
            key = new SecretKeySpec(keyBytes, "AES");

            // prepare encryption and decryption services using this key
            // using AES with CBC; see, e.g., http://www.javamex.com/tutorials/cryptography/block_modes.shtml
            decryptor = Cipher.getInstance("AES/CBC/PKCS5PADDING");

            encryptor = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            encryptor.init(Cipher.ENCRYPT_MODE, key);

        } catch (GeneralSecurityException e) {
            LOG.error(e);
        }

        this.decryptor = decryptor;
        this.encryptor = encryptor;

        LOG.info("Cluster communication encryption initialized");
    }

    @Override
    synchronized public void messageReceived(ChannelMessage msg) {
        LOG.info("onMessageReceived from " + msg.getAddress());
        if (decryptor == null) {
            LOG.warn("decryptor is null returning");
            return;
        }

        try {
            byte[] data = msg.getMessage().getBytes();

            try {

                ClassLoader[] classLoaders = new ClassLoader[2];
                classLoaders[0] = this.getClass().getClassLoader();
                classLoaders[1] = Thread.currentThread().getContextClassLoader();

                @SuppressWarnings("unchecked")
                HashMap<String, byte[]> packet = (HashMap<String, byte[]>) XByteBuffer.deserialize(data,0,data.length, classLoaders);
                byte[] encryptedData = packet.get(DATA_KEY);
                byte[] iv = packet.get(IV);

                decryptor.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
                byte[] decryptedData = decryptor.doFinal(encryptedData);

                msg.setMessage(new XByteBuffer(decryptedData, true));

            } catch (GeneralSecurityException | IOException | NullPointerException |
                    ClassCastException | ClassNotFoundException e) {
                LOG.error("our part of Message receive failed " + e.getMessage(), e);
            }

            super.messageReceived(msg);
        } catch (Exception e) {
            LOG.error("Message receive failed " + e.getMessage(), e);
        }
    }

    @Override
    synchronized public void sendMessage(Member[] destination, ChannelMessage msg,
                                         InterceptorPayload payload) throws ChannelException {
        LOG.info("sendingMessage");
        if (encryptor == null) {
            LOG.info("Encryptor was null returning");
            return;
        }

        try {
            byte[] data = msg.getMessage().getBytes();

            try {
                byte[] encryptedData = encryptor.doFinal(data);

                // AES/CBC produces encrypted data and an initialization vector (iv).
                // The receiver will need both. The iv can safely be sent in the clear.
                HashMap<String, byte[]> packet = new HashMap<>();
                packet.put(DATA_KEY, encryptedData);
                packet.put(IV, encryptor.getIV());

                byte[] packetData = XByteBuffer.serialize(packet);
                msg.setMessage(new XByteBuffer(packetData, true));

            } catch (Exception e) {
                LOG.error("Failed to perform our part of the send " + e.getMessage(), e);
            }

            super.sendMessage(destination, msg, payload);
        } catch (Exception e) {
            LOG.error("Failed to send message " + e.getMessage(), e);
        }
    }

}

