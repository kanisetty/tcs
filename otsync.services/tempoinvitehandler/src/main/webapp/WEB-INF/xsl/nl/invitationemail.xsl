<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="OpenText-banner"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Hallo!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
					<p><xsl:value-of select="/tempoinvite/invitee/@inviterdisplayname"/> heeft u uitgenodigd om <xsl:value-of select="/tempoinvite/@productName"/> te gaan gebruiken.</p>
					<xsl:if test="/tempoinvite/@extrainfo != ''">
						<p><b>Message from <xsl:value-of select="/tempoinvite/invitee/@inviterdisplayname"/>:</b>&#160;<xsl:value-of select="/tempoinvite/@extrainfo" disable-output-escaping="yes" /></p>
					</xsl:if>
					<p><b>Folder Name:</b>&#160;<xsl:value-of select="/tempoinvite/@foldername"/></p>
					<xsl:if test="/tempoinvite/@folderdesc != ''">
						<p><b>Folder Description:</b>&#160;<xsl:value-of select="/tempoinvite/@folderdesc" disable-output-escaping="yes" /></p>
					</xsl:if>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Klik op de volgende koppeling om uw registratie te voltooien:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:call-template name="validation-link"/></xsl:attribute><xsl:call-template name="validation-link"/></a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:11px;color:#444;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">U ontvangt dit bericht omdat uw e-mailadres (<xsl:value-of select="/tempoinvite/invitee/@email"/>) is gebruikt om toegang aan te vragen tot een OpenText Tempo-systeem. Als u de persoon die u heeft uitgenodigd niet kent, kunt u deze e-mail gewoon negeren.</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/acceptinvitation?invitationtoken=<xsl:value-of select="/tempoinvite/invitee/@token"/></xsl:template>
</xsl:stylesheet>
