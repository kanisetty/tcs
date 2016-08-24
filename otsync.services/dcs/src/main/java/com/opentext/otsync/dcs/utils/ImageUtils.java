package com.opentext.otsync.dcs.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.imgscalr.Scalr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageUtils {

    private static final Log LOG = LogFactory.getLog(ImageUtils.class);

    /**
     * Attempt to scale an image based on its physical size.
     *
     * @param imageToScale image file
     * @param maxFileSize  max file size in Kb
     * @throws IOException if we fail to read then scale the file
     */
    public static void scaleDocImageToProperSize(File imageToScale, int maxFileSize) throws IOException {
        float imageSizeKb = imageToScale.length() / 1000;
        if (imageSizeKb < maxFileSize) {
            if (LOG.isDebugEnabled())
                LOG.debug("File is already under max size, no need to scale");
            return;
        }

        float scale = maxFileSize / imageSizeKb;
        if (scale < 1) {
            BufferedImage image = ImageIO.read(imageToScale);
            int width = (int) (image.getWidth() * scale);
            int height = (int) (image.getHeight() * scale);
            BufferedImage scaled = Scalr.resize(image, Scalr.Mode.FIT_TO_WIDTH,
                    width, height, Scalr.OP_ANTIALIAS);
            ImageIO.write(scaled, "png", imageToScale);
        }
    }

}
