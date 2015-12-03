package com.opentext.otsync.content.ws.server;

import com.opentext.otsync.content.otag.ContentServerService;

public class CleanUpThread extends Thread {
    private ClientSet clients;
    private volatile boolean stopFlag = true;

    public CleanUpThread(ClientSet clients) {
        super("cleanup");
        this.clients = clients;
    }

    @Override
    public void run() {
        stopFlag = false;
        while (!stopFlag) {
            try {
                Thread.sleep(ContentServerService.getSettingsService().getCleanUpInterval() * 1000);
            } catch (Exception ignored) {
                // continue on and wake up from sleep
            }

            clients.discardOldClients();
        }
    }

    public synchronized void stopThread() {
        if (stopFlag)
            return;
        stopFlag = true;
        this.interrupt();
    }

}
