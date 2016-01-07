<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="success-template">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="Bannière OpenText"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Bienvenue dans OpenText Tempo!</b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Un partage de documents sécurisé, facile, rapide et professionel, accessible en un clic!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- Try tempo now for 90 days... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempowebappurl"/></xsl:attribute>Adoptez dès maintenant OpenText Tempo!</a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- You're used to sharing... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Pour vous assurer de toujours avoir votre contenu à portée de main, vous avez sans doute l'habitude de partager vos fichiers par courrier électronique et de les déplacer entre plusieurs périphériques.  OpenText Tempo change complètement la donne.  Avec OpenText Tempo, vous pouvez synchroniser votre contenu, instantanément et automatiquement, sur tous vos ordinateurs et périphériques mobiles.  Vous pouvez également partager facilement des informations avec vos collègues en temps réel, depuis un navigateur Web.</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Utilisez OpenText Tempo sur votre smartphone, votre tablette ou votre bureau Windows:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>iPhone et iPad: </b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoiosappurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoiosappurl"/></a></b></td>
			</tr>
                        <tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>BlackBerry:</b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempobbappurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempobbappurl"/></a></b> depuis votre navigateur Web BlackBerry</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Android:</b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></a></b> depuis votre périphérique Android</td>
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
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Lors de la configuration de votre compte OpenText Tempo, utilisez l’adresse suivante lorsque le système vous demande de saisir l’adresse URL du serveur:</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempourl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempourl"/></a></b></td>
			</tr>

			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"> Remarque: veuillez utiliser le lien suivant pour réinitialiser ou modifier le mot de passe de votre compte OpenText Tempo:</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/forgotpassword</xsl:template></td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
