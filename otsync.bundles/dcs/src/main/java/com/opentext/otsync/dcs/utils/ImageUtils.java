package com.opentext.otsync.dcs.utils;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

public class ImageUtils {
    private static boolean saveBufferedImageAsJPEG(BufferedImage image, String imagePath) {
        FileOutputStream outputStream;
        boolean success = true;

        try {
            outputStream = new FileOutputStream(imagePath);

            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(outputStream);
            JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(image);

            param.setQuality(0.93f, true);

            encoder.setJPEGEncodeParam(param);
            encoder.encode(image);

            outputStream.close();
        } catch (Exception ex) {
            success = false;
        }

        return success;
    }

    public static void scaleDocImageToProperSize(File imageToScale, int maxFileSize) throws IOException {
        double scale = Math.sqrt(imageToScale.length() / maxFileSize);
        if (scale > 1) {
            BufferedImage image = ImageIO.read(imageToScale);
            int width = (int) (image.getWidth() / scale);
            int height = (int) (image.getHeight() / scale);

            int type = (image.getTransparency() == java.awt.Transparency.OPAQUE) ?
                    BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
            BufferedImage tmp = new BufferedImage(width, height, type);
            Graphics2D g2 = tmp.createGraphics();

            BufferedImage tmpImage = image;
            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g2.drawImage(tmpImage, 0, 0, width, height, null);
            g2.dispose();

            tmpImage = tmp;
            saveBufferedImageAsJPEG(tmpImage, imageToScale.getAbsolutePath());
        }
    }
}
