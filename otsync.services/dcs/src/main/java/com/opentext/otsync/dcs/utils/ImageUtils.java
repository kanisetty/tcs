package com.opentext.otsync.dcs.utils;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ImageUtils {
    private static boolean saveBufferedImageAsJPEG(BufferedImage image, String imagePath) {
        try {
            FileOutputStream outputStream = new FileOutputStream(imagePath);
            ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("jpg").next();
            ImageWriteParam jpgWriteParam = jpgWriter.getDefaultWriteParam();
            jpgWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            jpgWriteParam.setCompressionQuality(0.93f);

            jpgWriter.setOutput(outputStream);
            IIOImage outputImage = new IIOImage(image, null, null);
            jpgWriter.write(null, outputImage, jpgWriteParam);
            jpgWriter.dispose();

            outputStream.close();
        } catch (Exception ex) {
            return false;
        }

        return true;
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
