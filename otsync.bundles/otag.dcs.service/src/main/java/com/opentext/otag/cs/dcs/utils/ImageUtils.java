package com.opentext.otag.cs.dcs.utils;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;

public class ImageUtils {

    public static boolean scaleDocImageBeforeUpload(File imageFile, int size,
                                                    boolean higherQuality, boolean fixedWidth) throws Exception {
        boolean success;

        int targetWidth, targetHeight;
        BufferedImage image = ImageIO.read(imageFile);

        double imageHeight = image.getHeight();
        double imageWidth = image.getWidth();

        double tmpH, tmpW, ratio;

        if (imageHeight >= imageWidth) {
            ratio = imageHeight / imageWidth;
            tmpW = size;
            tmpH = size * ratio;
        } else {
            ratio = imageWidth / imageHeight;

            if (fixedWidth) {
                tmpH = size / ratio;
                tmpW = size;
            } else {
                tmpH = size;
                tmpW = size * ratio;
            }
        }
        targetWidth = (int) tmpW;
        targetHeight = (int) tmpH;
        int type = (image.getTransparency() == java.awt.Transparency.OPAQUE) ?
                BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        BufferedImage tmpImage = image;
        int w, h;
        if (higherQuality) {
            w = image.getWidth();
            h = image.getHeight();
        } else {
            w = targetWidth;
            h = targetHeight;
        }
        if ((targetWidth >= image.getWidth()) || (targetHeight >= image.getHeight())) {
            w = targetWidth;
            h = targetHeight;
            higherQuality = false;
        }
        do {
            if (higherQuality && w > targetWidth) {
                w /= 2;

                if (w < targetWidth) {
                    w = targetWidth;
                }
            }

            if (higherQuality && h > targetHeight) {
                h /= 2;

                if (h < targetHeight) {
                    h = targetHeight;
                }
            }

            BufferedImage tmp = new BufferedImage(w, h, type);
            Graphics2D g2 = tmp.createGraphics();

            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g2.drawImage(tmpImage, 0, 0, w, h, null);
            g2.dispose();

            tmpImage = tmp;

        } while (w != targetWidth || h != targetHeight);
        success = saveBufferedImageAsJPEG(tmpImage, imageFile.getAbsolutePath());

        return success;
    }

    private static boolean saveBufferedImageAsJPEG(BufferedImage image, String imagePath) {
        FileOutputStream outputStream;
        boolean success = true;

        try {
            outputStream = new FileOutputStream(imagePath);

            // TODO FIXME test, I had to replace some illegal use of sun packages here, old pre Java7 code
            // ImagIO is the replacement API
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
            success = false;
        }

        return success;
    }
}
