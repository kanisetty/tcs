<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="success-template">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="Mensaje de cabecera de OpenText"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>¡Bienvenido a OpenText Tempo!</b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">¡Está a sólo un clic de compartir de forma fácil, rápida y segura, con un giro empresarial!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- Try tempo now for 90 days... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempowebappurl"/></xsl:attribute>¡Comience a utilizar OpenText Tempo ahora!</a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- You're used to sharing... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Para garantizar que su contenido se encuentre siempre disponible, es probable que esté acostumbrado a compartir archivos por correo electrónico y a mover sus documentos entre multitud de dispositivos.  Todo esto se transforma con OpenText Tempo.  Con OpenText Tempo, puede sincronizar su contenido de forma automática e instantánea en todos sus ordenadores y dispositivos móviles.  También puede compartir información sin esfuerzo con compañeros en tiempo real desde un navegador web.</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Disfrute de las ventajas de OpenText Tempo en su smartphone, tableta y escritorio de Windows:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>iPhone y iPad: </b></td>
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
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></a></b> desde su dispositivo Android</td>
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
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Cuando configure su cliente OpenText Tempo, utilice la siguiente dirección cuando se solicite la URL del servidor:</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempourl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempourl"/></a></b></td>
			</tr>

			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"> Nota: para restablecer o cambiar su contraseña para su cuenta de OpenText Tempo, utilice el siguiente enlace:</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/forgotpassword</xsl:template></td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
