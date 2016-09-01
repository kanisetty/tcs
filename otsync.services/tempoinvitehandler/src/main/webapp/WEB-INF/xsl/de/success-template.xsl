<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="success-template">
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
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Willkommen bei OpenText Tempo!</b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Nur noch ein Klick, und Sie können die sichere, einfache und schnelle Dateifreigabe mit dem gewissen Unternehmenskniff nutzen!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- Try tempo now for 90 days... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempowebappurl"/></xsl:attribute>Verwenden Sie jetzt OpenText Tempo!</a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- You're used to sharing... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Um Ihre Inhalte jederzeit und überall zur Verfügung zu haben, sind Sie wahrscheinlich daran gewöhnt, Dateien per E-Mail auszutauschen und Dokumente über diverse Geräte zu versenden und zu reproduzieren.  Das alles hat mit OpenText Tempo ein Ende.  Mit OpenText Tempo können Sie Ihre Inhalte mit all Ihren Computern und Mobilgeräten sofort und automatisch synchronisieren.  Außerdem können Sie Informationen mühelos in Echtzeit über einen Webbrowser mit Ihren Kollegen austauschen.</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Nutzen Sie OpenText Tempo auf Ihrem Smartphone, Tablet und Windows-Desktop:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>iPhone und iPad: </b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoiosappurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoiosappurl"/></a></b></td>
			</tr>
                        <tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Android:</b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></a></b> von Ihrem Android-Gerät</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>	
			
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Microsoft Windows: </b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempopcdesktopurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempopcdesktopurl"/></a></b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Verwenden Sie beim Einrichten Ihres OpenText Tempo-Clients die folgende Adresse, wenn Sie zur Eingabe der Server-URL aufgefordert werden:</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempourl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempourl"/></a></b></td>
			</tr>

			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"> Hinweis: Um Ihr Kennwort für Ihr OpenText Tempo-Konto zurückzusetzen oder zu ändern, verwenden Sie die folgende Verknüpfung:</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/forgotpassword</xsl:template></td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
