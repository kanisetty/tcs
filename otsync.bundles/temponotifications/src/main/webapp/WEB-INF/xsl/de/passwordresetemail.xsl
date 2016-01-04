<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="OpenText-Banner"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:14px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Herzlich willkommen!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Um das Zurücksetzen Ihres Kennworts für Ihren Benutzernamen <xsl:value-of select="/tempoinvite/user/@username"/> abzuschließen, klicken Sie bitte auf die folgende Verknüpfung:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:call-template name="pwreset-link"/></xsl:attribute><xsl:call-template name="pwreset-link"/></a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:11px;color:#444;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Sie erhalten diese Nachricht, weil Ihre E-Mail-Adresse (<xsl:value-of select="/tempoinvite/user/@email"/>) dazu verwendet wurde, den Zugang zu OpenText Tempo anzufordern. Wenn Sie den Zugang nicht angefordert haben, können Sie diese E-Mail ignorieren.</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template name="pwreset-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/validatepwreset?token=<xsl:value-of select="/tempoinvite/user/@token"/></xsl:template>
</xsl:stylesheet>
