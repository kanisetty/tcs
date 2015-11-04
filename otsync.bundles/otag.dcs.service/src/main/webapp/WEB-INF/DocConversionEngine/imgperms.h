/*-------------------------- SPICER SIG H_File ----------------------------

    H_File: imgperms.h
    Purpose: Contains the defined SIG Bits for the Imagenation Signature file

 Revisions:
 $Log: imgperms.h $
 Revision 51.52  2007/07/20 11:26:23  mcewend
 added perm bit #define PERM_OCE_VIEWER 9 and fix date
 Revision 51.50  2007/02/28 13:54:31  mcewend
 added Xerox OEM ID SIG_OEM_XEROX 919
 Revision 51.49  2006/11/01 15:25:35  mcewend
 Solidworks and Adinventor 2D-3D mods and additions
 Revision 51.48  2006/10/19 13:41:14  zhangle
 Added SVGZ read and write.
 Revision 51.47  2006/09/21 13:01:32  zhouj
 Add  PERM_EFL_READ_PDF  for PDF read only
 Revision 51.46  2006/01/05 10:44:10  mcewend
 removed TABs from JBIG and MSMSG perms
 Revision 51.45  2005/12/14 15:54:10  zhouj
 Add the support of loading JBIG2 raster file using JBIG2dec library. 
 Revision 51.44  2005/10/17 14:58:33  zhouj
 Add new format FMT_MSMSG for recognition server.
 Revision 51.43  2005/06/17 15:57:33  chens
 Added UG, Parasolid, and CATIA5 constants
 Revision 51.42  2004/07/08 16:24:45  wuq
 Added permission for ADINVENTOR and JTOPEN
 Revision 51.41  2003/11/05 16:13:00  QiongWu
 Added SVG write permission for 7.4
 Revision 51.40  2003/10/16 16:46:37  QiongWu
 Added OEM Billion Group product, BGP
 Revision 51.39  2003/02/11 12:05:21  QiongWu
 ECN 7.2 perms
 Revision 51.38  2003/01/29 17:18:03  QiongWu
 Hold on ESRI for next release
 Revision 51.37  2003/01/29 15:55:44  QiongWu
 Added perm bits for XGL, VISIO and ESRIA
 Revision 51.36  2002/12/23 16:01:47  QiongWu
 Added permission bits for SOLIDWORKS
 Revision 51.35  2002/07/05 13:31:11  QiongWu
 Made adjustments of perm bits before ECN
 Revision 51.34  2002/06/20 15:15:40  QiongWu
 Setup DGN Version8 bit in SIG
 Revision 51.33  2002/04/17 16:14:43  QiongWu
 Added Minimize Render bit for ViewCafe enhancement
 Revision 51.32  2002/04/01 16:22:41Z  wanr
 Added JP2 write entry
 Revision 51.31  2001/10/03 21:26:10Z  QiongWu
 Added OCE LT color product
 Revision 51.30  2001/09/21 20:41:37Z  rastasj
  Added SVG write permission bit
 Revision 51.29  2001/08/07 17:27:03Z  QiongWu
 Change PERM_ALLFORMS to PERM_IMAGENATION_WITH_CONTROLS
 Revision 51.28  2001/07/25 18:40:58Z  QiongWu
 Added allforms bit for internal use
 Revision 51.27  2001/07/24 15:34:41Z  QiongWu
 Created Image A.X SIG bit. Remove the perm bit
 Revision 51.26  2001/07/18 17:56:27Z  QiongWu
 Added some 3D formats definition 
 Revision 51.25  2001/07/05 14:00:55Z  QiongWu
 Added SVG read permission bit
 Revision 51.24  2001/04/23 22:11:20Z  QiongWu
 Add Gerber format READ/WRITE perm bits
 Revision 51.23  2001/04/04 18:33:17Z  QiongWu
 Add XMS format READ/WRITE permission bits
 Revision 51.22  2001/03/19 19:13:49Z  QiongWu
 Added new SIG bit to identify Image a.X product
 Revision 51.21  2001/03/15 21:39:11Z  QiongWu
 Add permission bits for ActiveX view and markup
 Revision 51.20  2000/10/24 19:46:15Z  MAKER
 Removed tabs by David McEwen
 Revision 51.18  2000/09/25 14:24:16Z  obriens
 Updated comments
 Revision 51.17  2000/09/25 14:24:16Z  obriens
 Updated comments
 Revision 51.16  2000/09/25 14:21:39Z  obriens
 Added log section.
 Revision 51.15  2000/09/22 20:24:05Z  obriens
 Added new SIG Bit to identify Service Application(PERM_SERVICE)


------------------------------------------------------------------------------*/
/* imgperms.h                                          */
/*                                                     */
/* Revised 20.05.97 by C. Desjardins                   */
/* 	deleted obsolete permission bits,              */
/*      renamed some permission bits, and              */
/*      renumbered remaining permission bits           */
/* Revised 25.06.97 by C. Karges                       */
/*      added perm bit PERM_EFL_READ_COLD              */
/* Revised 11.08.97 by C. Karges                       */
/*      added perm bits PERM_DEBUG_REPORTS,            */
/*      PERM_DDE_CMDS_REPORT, PERM_UI_COMMANDS_REPORT, */
/*      PERM_FORMATS_REPORT, and PERM_CFG_REPORT       */
/* Revised 20.08.97 by C. Karges                       */
/*      added perm bits PERM_READ_CFX, PERM_WRITE_CFX  */
/* Revised 23.09.97 by C. Karges                       */
/*      added perm bits PERM_WRITE_ATTC_DC,            */
/*      PERM_WRITE_TIFF_MULTIPAGE, PERM_WRITE_DCX,     */
/*      and PERM_WRITE_LS                              */
/* Revised 02.10.97 by C. Karges                       */
/*      added PERM_SCAN_SETUP                          */
/* Revised 17.10.97 by C. Karges                       */
/*      recycled PERM_READ_LZW and PERM_WRITE_LZW to   */
/*      PERM_LZW_TIFF, PERM_LZW_GIF                    */
/*      added PERM_LZW_PS and PERM_LZW_PDF             */
/* Revised 21.10.97 by C. Karges                       */
/*      added PERM_EFL_READ_MSWORD97                   */
/* Revised 26.06.98 by C. Karges                       */
/*	added PERM_HDR_READ_IOCA, PERM_HDR_READ_DDIF,  */
/*	PERM_HDR_READ_VDS, PERM_EFL_READ_EXCEL97,      */
/*	and PERM_EFL_READ_MODCA                        */
/* Revised 24.07.98 by C. Karges                       */
/*	added PERM_PDF_ENCRYPTION                      */
/* Revised 18.10.99 by D. McEwen                     */
/*	added PERM_EFL_READ_CATIA, PERM_EFL_WRITE_CATIA,   */
/*	PERM_EFL_READ_CADDS, PERM_EFL_WRITE_CADDS,         */
/*	PERM_EFL_READ_SBD, PERM_EFL_WRITE_SBD,             */
/*	PERM_EFL_READ_VRML, PERM_EFL_WRITE_VRML,           */
/*	PERM_EFL_READ_STL, PERM_EFL_WRITE_STL              */
/*	and PERM_CADPP                                     */
/* Revised 05.11.99 by D. McEwen                     */
/*	added IMG_LEVEL_HIGH3D                           */
/* Revised 12.11.99 by D. McEwen                     */
/*	remove IMG_LEVEL_HIGH3D                           */
/*	added PERM_HIGH3D                           */
/*--------------------------------------------------------------------------------
     Copyright (c)2000 SPICER Corporation, All rights reserved.
------------------------------------------------------------------------------*/


#ifndef INC_PERMS
#define INC_PERMS

#define PERM_COMMERCIAL                            1
#define PERM_SCAN                                  2
#define PERM_SCAN_SETUP                            3  
#define PERM_HIGH3D                                4 
#define PERM_SERVICE                               5
#define PERM_IMAGENATION_WITH_CONTROLS             6
#define PERM_ROI_VIEWER                            7      
#define PERM_MINIMIZE_RENDER                       8      
#define PERM_OCE_VIEWER                            9      

#define PERM_LIB_IGES                             20
#define PERM_ODMA_SUPPORT                         21
#define PERM_OLE2_DRAG_N_DROP                     22
#define PERM_OLE2_SUPPORT                         23

#define PERM_DETAIL_WINDOW                        30
#define PERM_LINE_WINDOW                          31
#define PERM_LAYER_WINDOW                         32
#define PERM_REL_MEASURE                          33
#define PERM_SYMBOL_PALETTE                       34
#define PERM_SYSTEM_LANGUAGE                      35

#define PERM_CODE_COPYDOCUMENT                    40
#define PERM_CODE_LINE                            41
#define PERM_CODE_ARC                             42
#define PERM_CODE_ARROW                           43
#define PERM_CODE_BOX                             44
#define PERM_CODE_CIRCLE                          45
#define PERM_CODE_ELLIPSE                         46
#define PERM_CODE_SKETCH                          47
#define PERM_CODE_POLYLINE                        48
#define PERM_CODE_POLYGON                         49

#define PERM_CODE_HIGHLIGHTER                     50
#define PERM_CODE_SHADER                          51 
#define PERM_CODE_DIMENSION                       52
#define PERM_CODE_TEXT                            53
#define PERM_CODE_ANNOTATION                      54
#define PERM_CODE_SYMBOL                          55
#define PERM_CODE_HOTSPOT                         56
#define PERM_CODE_SELECT                          57
#define PERM_CODE_MOVERESIZE                      58
#define PERM_CODE_ROTATE                          59

#define PERM_CODE_CUT                             60
#define PERM_CODE_COPY                            61
#define PERM_CODE_PASTE                           62
#define PERM_CODE_RUBOUT                          63
#define PERM_CODE_ERASE                           64
#define PERM_CODE_SELECTALL                       65
#define PERM_CODE_DESELECTALL                     66
#define PERM_CODE_DELETE                          67
#define PERM_CODE_SAVEASSYMBOL                    68
#define PERM_CODE_BIND                            69

#define PERM_CODE_UNBIND                          70
#define PERM_CODE_CHANGETEXT                      71
#define PERM_CODE_CHANGEATTR                      72
#define PERM_CODE_TOOLOPTS                        73
#define PERM_CODE_EDITOPTS                        74
#define PERM_CODE_TOOLPREFS                       75
#define PERM_CODE_EDITPREFS                       76
#define PERM_CODE_UTILITY_MERGE                   77
#define PERM_CODE_UTILITY_DESPECKLE               78
#define PERM_CODE_UTILITY_DESKEW                  79

#define PERM_CODE_UTILITY_RASTER                  80
#define PERM_CODE_UTILITY_RESIZE                  81
#define PERM_CODE_UTILITY_CROP                    82
#define PERM_CODE_UTILITY_UNDO                    83
#define PERM_HDR_READ_GEM                         84
#define PERM_HDR_WRITE_GEM                        85
#define PERM_READ_GEM                             86
#define PERM_WRITE_GEM                            87
#define PERM_HDR_READ_TIFF_LSB                    88
#define PERM_HDR_WRITE_TIFF_LSB                   89

#define PERM_HDR_READ_CALS1                       90
#define PERM_HDR_WRITE_CALS1                      91
#define PERM_HDR_READ_CALS2                       92
#define PERM_HDR_WRITE_CALS2                      93
#define PERM_HDR_READ_AIIM_CALS2                  94
#define PERM_HDR_WRITE_AIIM_CALS2                 95
#define PERM_HDR_READ_PIDH                        96
#define PERM_HDR_WRITE_PIDH                       97
#define PERM_HDR_READ_SKANTEK_MSB                 98
#define PERM_HDR_WRITE_SKANTEK_MSB                99

#define PERM_HDR_READ_SKANTEK_LSB                100
#define PERM_HDR_WRITE_SKANTEK_LSB               101
#define PERM_HDR_READ_CIM                        102
#define PERM_HDR_WRITE_CIM                       103
#define PERM_READ_CIM                            104
#define PERM_WRITE_CIM                           105
#define PERM_HDR_READ_CMP                        106
#define PERM_HDR_WRITE_CMP                       107
#define PERM_READ_CMP                            108
#define PERM_WRITE_CMP                           109

#define PERM_HDR_READ_FNT                        110
#define PERM_HDR_WRITE_FNT                       111
#define PERM_READ_FNT                            112
#define PERM_WRITE_FNT                           113
#define PERM_HDR_READ_FNTBAND                    114
#define PERM_HDR_WRITE_FNTBAND                   115
#define PERM_READ_FNT_BANDED                     116
#define PERM_WRITE_FNT_BANDED                    117
#define PERM_HDR_READ_FNI                        118
#define PERM_HDR_WRITE_FNI                       119

#define PERM_HDR_READ_NIFF                       120
#define PERM_HDR_WRITE_NIFF                      121
#define PERM_HDR_READ_PCX                        122
#define PERM_HDR_WRITE_PCX                       123
#define PERM_READ_PCX                            124
#define PERM_WRITE_PCX                           125
#define PERM_HDR_READ_ACCESS                     126
#define PERM_HDR_WRITE_ACCESS                    127
#define PERM_HDR_READ_RLC                        128
#define PERM_HDR_WRITE_RLC                       129

#define PERM_READ_RLC                            130
#define PERM_WRITE_RLC                           131
#define PERM_HDR_READ_BROOKTROUT                 132
#define PERM_HDR_WRITE_BROOKTROUT                133
#define PERM_HDR_READ_INTERGRAPH                 134
#define PERM_HDR_WRITE_INTERGRAPH                135
#define PERM_HDR_READ_TIFF_MSB                   136
#define PERM_HDR_WRITE_TIFF_MSB                  137
#define PERM_READ_G3_TIFF                        138
#define PERM_WRITE_G3_TIFF                       139

#define PERM_READ_G3_MSB                         140
#define PERM_WRITE_G3_MSB                        141
#define PERM_READ_G4_LSB                         142
#define PERM_WRITE_G4_LSB                        143
#define PERM_READ_G4_MSB                         144
#define PERM_WRITE_G4_MSB                        145
#define PERM_READ_G4_TILED                       146
#define PERM_WRITE_G4_TILED                      147
#define PERM_READ_G4_STRIPPED                    148
#define PERM_WRITE_G4_STRIPPED                   149

#define PERM_HDR_READ_VIDAR_ORGIN                150
#define PERM_HDR_WRITE_VIDAR_ORIGIN              151
#define PERM_HDR_READ_VIDAR_EXT                  152
#define PERM_HDR_WRITE_VIDAR_EXT                 153
#define PERM_HDR_READ_VIDAR_VER1                 154
#define PERM_HDR_WRITE_VIDAR_VER1                155
#define PERM_READ_VIDAR_RLC                      156
#define PERM_WRITE_VIDAR_RLC                     157
#define PERM_HDR_READ_CCRF                       158
#define PERM_HDR_WRITE_CCRF                      159

#define PERM_WRITE_CCRF                          160
#define PERM_HDR_READ_S6                         161
#define PERM_HDR_WRITE_S6                        162
#define PERM_WRITE_S6                            163
#define PERM_READ_S6                             164
#define PERM_HDR_WRITE_HIRF                      165
#define PERM_HDR_READ_HIRF                       166
#define PERM_READ_BMP                            167
#define PERM_WRITE_BMP                           168
#define PERM_READ_PACKBITS                       169

#define PERM_WRITE_PACKBITS                      170
#define PERM_READ_RAW_MSB                        171
#define PERM_WRITE_RAW_MSB                       172
#define PERM_READ_RAW_LSB                        173
#define PERM_WRITE_RAW_LSB                       174
#define PERM_READ_VIDAR_RLE                      175
#define PERM_WRITE_VIDAR_RLE                     176
#define PERM_READ_RLE_TILED                      177
#define PERM_WRITE_RLE_TILED                     178
#define PERM_HDR_READ_DSI                        179

#define PERM_HDR_WRITE_DSI                       180
#define PERM_WRITE_RAW_TILED                     181
#define PERM_WRITE_RAW_STRIPE                    182
#define PERM_READ_MULTI_PIF                      183
#define PERM_WRITE_MULTI_PIF                     184
#define PERM_READ_MULTI_SMF                      185
#define PERM_WRITE_MULTI_SMF                     186
#define PERM_READ_COMPLIST                       187
#define PERM_WRITE_COMPLIST                      188
#define PERM_READ_DAS                            189

#define PERM_WRITE_DAS                           190
#define PERM_HDR_READ_FORMTEK                    191
#define PERM_HDR_WRITE_FORMTEK                   192
#define PERM_LZW_TIFF                            193
#define PERM_LZW_GIF                             194
#define PERM_HDR_READ_CALSB                      195
#define PERM_HDR_WRITE_CALSB                     196
#define PERM_HDR_READ_JFIF                       197
#define PERM_HDR_WRITE_JFIF                      198
#define PERM_READ_JPEG                           199

#define PERM_WRITE_JPEG                          200
#define PERM_HDR_READ_DCX                        201
#define PERM_HDR_WRITE_DCX                       202
#define PERM_HDR_READ_XIONICS                    203
#define PERM_HDR_WRITE_XIONICS                   204
#define PERM_HDR_READ_DOCUVISION                 205
#define PERM_HDR_WRITE_DOCUVISION                206
#define PERM_HDR_READ_AUTOTROL                   207
#define PERM_HDR_WRITE_AUTOTROL                  208
#define PERM_READ_AUTOTROL_DX                    209

#define PERM_WRITE_AUTOTROL_DX                   210
#define PERM_READ_AUTOTROL_COMP                  211
#define PERM_WRITE_AUTOTROL_COMP                 212
#define PERM_HDR_READ_LASER_DATA_VIEW            213
#define PERM_HDR_WRITE_LASER_DATA_VIEW           214
#define PERM_READ_WINFAX                         215
#define PERM_WRITE_WINFAX                        216
#define PERM_HDR_READ_PHOTOMATRIX                217
#define PERM_HDR_WRITE_PHOTOMATRIX               218
#define PERM_HDR_READ_GENG4                      219

#define PERM_HDR_READ_SUN                        220
#define PERM_HDR_WRITE_SUN                       221
#define PERM_READ_SUN_RLE                        223
#define PERM_WRITE_SUN_RLE                       224
#define PERM_READ_SUN_RGB                        225
#define PERM_WRITE_SUN_RGB                       226
#define PERM_HDR_READ_TG4                        227
#define PERM_HDR_WRITE_TG4                       228
#define PERM_READ_XWD                            229

#define PERM_WRITE_XWD                           230
#define PERM_HDR_READ_FILEMAGIC                  231
#define PERM_HDR_WRITE_FILEMAGIC                 232
#define PERM_HDR_READ_EDMICS                     233
#define PERM_HDR_WRITE_EDMICS                    234
#define PERM_READ_LZ77                           235
#define PERM_WRITE_LZ77                          236
#define PERM_HDR_READ_PNG                        237
#define PERM_HDR_WRITE_PNG                       238
#define PERM_HDR_READ_TARGA                      239

#define PERM_HDR_WRITE_TARGA                     240
#define PERM_READ_TARGA                          241
#define PERM_WRITE_TARGA                         242
#define PERM_HDR_GTX_PRJ_READ                    243
#define PERM_HDR_GTX_PRJ_WRITE                   244
#define PERM_HDR_READ_WPG                        245
#define PERM_HDR_WRITE_WPG                       246
#define PERM_EFL_READ_DSI                        247
#define PERM_EFL_WRITE_DSI                       248
#define PERM_EFL_READ_MI                         249

#define PERM_EFL_WRITE_MI                        250
#define PERM_EFL_READ_RTF                        251
#define PERM_EFL_WRITE_RTF                       252
#define PERM_EFL_READ_EDT                        253
#define PERM_EFL_WRITE_EDT                       254
#define PERM_EFL_READ_DWG                        255
#define PERM_EFL_WRITE_DWG                       256
#define PERM_EFL_READ_WPERFECT                   257
#define PERM_EFL_WRITE_WPERFECT                  258
#define PERM_EFL_READ_WPERFECT6                  259

#define PERM_EFL_WRITE_WPERFECT6                 260
#define PERM_EFL_READ_DRW1                       261
#define PERM_EFL_WRITE_DRW1                      262
#define PERM_EFL_READ_DRW2                       263
#define PERM_EFL_WRITE_DRW2                      264
#define PERM_EFL_READ_DXF                        265
#define PERM_EFL_WRITE_DXF                       266
#define PERM_EFL_READ_DSIDWG                     267
#define PERM_EFL_WRITE_DSIDWG                    268
#define PERM_EFL_READ_HPGL                       269

#define PERM_EFL_WRITE_HPGL                      270
#define PERM_EFL_READ_ASCIITEXT                  271
#define PERM_EFL_WRITE_ASCIITEXT                 272
#define PERM_EFL_READ_DGN                        273
#define PERM_EFL_WRITE_DGN                       274
#define PERM_EFL_READ_MSWORD6                    275
#define PERM_EFL_WRITE_MSWORD6                   276
#define PERM_EFL_READ_MSWRITE                    277
#define PERM_EFL_WRITE_MSWRITE                   278
#define PERM_EFL_READ_AUTOTROL                   279

#define PERM_EFL_WRITE_AUTOTROL                  280
#define PERM_EFL_READ_CGM                        281
#define PERM_EFL_WRITE_CGM                       283
#define PERM_EFL_READ_WMF                        284
#define PERM_EFL_WRITE_WMF                       285
#define PERM_EFL_READ_PICT                       286
#define PERM_EFL_WRITE_PICT                      287
#define PERM_EFL_READ_EXCEL                      288
#define PERM_EFL_READ_POSTSCRIPT                 289

#define PERM_EFL_WRITE_POSTSCRIPT                290
#define PERM_EFL_READ_CADRA                      291
#define PERM_EFL_WRITE_CADRA                     292
#define PERM_EFL_READ_AQUA                       293
#define PERM_EFL_READ_COLD                       294
#define PERM_DEBUG_REPORTS                       295
#define PERM_DDE_CMDS_REPORT                     296
#define PERM_UI_COMMANDS_REPORT                  297
#define PERM_FORMATS_REPORT                      298
#define PERM_CFG_REPORT                          299

#define PERM_READ_CFX                            300
#define PERM_WRITE_CFX                           301
#define PERM_WRITE_ATTC_DC                       302
#define PERM_WRITE_TIFF_MULTIPAGE                303
#define PERM_WRITE_DCX                           304
#define PERM_WRITE_LS                            305
#define PERM_LZW_PS                              306
#define PERM_LZW_PDF                             307
#define PERM_EFL_READ_MSWORD97                   308
#define PERM_HDR_READ_IOCA                       309

#define PERM_HDR_READ_DDIF                       310
#define PERM_HDR_READ_VDS                        311
#define PERM_EFL_READ_EXCEL97                    312
#define PERM_EFL_READ_MODCA                      313
#define PERM_PDF_ENCRYPTION                      314
#define PERM_EFL_READ_CATIA                      315
#define PERM_EFL_WRITE_CATIA                     316
#define PERM_EFL_READ_CADDS                      317
#define PERM_EFL_WRITE_CADDS                     318
#define PERM_EFL_READ_SBD                        319

#define PERM_EFL_WRITE_SBD                       320
#define PERM_EFL_READ_VRML                       321
#define PERM_EFL_WRITE_VRML                      322
#define PERM_EFL_READ_STL                        323
#define PERM_EFL_WRITE_STL                       324
#define PERM_CADPP                               325
#define PERM_EFL_READ_DS2                        326
#define PERM_EFL_WRITE_DS2                       327
#define PERM_EFL_READ_DWF                        328 /* PM ADD */
#define PERM_EFL_READ_XMS                        329 /* XMS read permission bit */

#define PERM_EFL_WRITE_XMS                       330 /* XMS write permission bit */
#define PERM_EFL_READ_GERBER                     331 /* Gerber read permission bit */
#define PERM_EFL_WRITE_GERBER                    332 /* Gerber write permission bit */
#define PERM_EFL_READ_SVG                        333 /* SVG read permission bit */
#define PERM_EFL_READ_ACIS_CATIA                 334
#define PERM_EFL_WRITE_ACIS_CATIA                335
#define PERM_EFL_READ_ACIS_IGES                  336
#define PERM_EFL_WRITE_ACIS_IGES                 337
#define PERM_EFL_READ_ACIS_PROE                  338
#define PERM_EFL_WRITE_ACIS_PROE                 339

#define PERM_EFL_READ_ACIS_SAT                   340
#define PERM_EFL_WRITE_ACIS_SAT                  341
#define PERM_EFL_READ_ACIS_STEP                  342
#define PERM_EFL_WRITE_ACIS_STEP                 343
#define PERM_EFL_READ_ACIS_VDAFS                 344
#define PERM_EFL_WRITE_ACIS_VDAFS                345
#define PERM_EFL_WRITE_PDF                       346 
#define PERM_EFL_READ_MRSID                      347
#define PERM_EFL_READ_POCKET_OFFICE              348 
#define PERM_EFL_READ_VISIO                      349

#define PERM_EFL_READ_SOLIDWORKS3D               350
#define PERM_EFL_WRITE_SOLIDWORKS3D              351
#define PERM_EFL_READ_XGL                        352
#define PERM_EFL_WRITE_XGL                       353
#define PERM_EFL_WRITE_SVG                       354
#define PERM_EFL_READ_ADINVENTOR3D               355
#define PERM_EFL_WRITE_ADINVENTOR3D              356
#define PERM_EFL_READ_JTOPEN                     357
#define PERM_EFL_WRITE_JTOPEN                    358
#define PERM_EFL_READ_ACIS_UGS                   359

#define PERM_EFL_WRITE_ACIS_UGS                  360
#define PERM_EFL_READ_ACIS_PARASOLID             361
#define PERM_EFL_WRITE_ACIS_PARASOLID            362
#define PERM_EFL_READ_ACIS_CATIA_V5              363
#define PERM_EFL_WRITE_ACIS_CATIA_V5             364
#define PERM_EFL_READ_MSMSG                      365
#define PERM_EFL_WRITE_MSMSG                     366
#define PERM_EFL_READ_JBIG2                      367
#define PERM_EFL_WRITE_JBIG2                     368
#define PERM_EFL_READ_PDF                        369 

#define PERM_EFL_READ_SVGZ                       370
#define PERM_EFL_WRITE_SVGZ                      371
#define PERM_EFL_READ_SOLIDWORKS2D               372
#define PERM_EFL_WRITE_SOLIDWORKS2D              373
#define PERM_EFL_READ_ADINVENTOR2D               374
#define PERM_EFL_WRITE_ADINVENTOR2D              375

#define IMG_LEVEL_VIEW                           900
#define IMG_LEVEL_REDLINE                        901
#define IMG_LEVEL_MARKUP                         902
#define IMG_LEVEL_EDIT                           903
#define IMG_LEVEL_ANNOTATE                       904

#define SIG_OEM_FILENET                          910
#define SIG_OEM_ACCESS                           911
#define SIG_OEM_MARCAM                           912
#define SIG_OEM_IDENTITECH                       913
#define SIG_OEM_VIDAR                            914
#define SIG_OEM_OCE                              915
#define SIG_OEM_DATASCAN                         916
#define SIG_OEM_SPICER                           917  
#define SIG_OEM_BGP                              918  
#define SIG_OEM_XEROX                            919

#endif



