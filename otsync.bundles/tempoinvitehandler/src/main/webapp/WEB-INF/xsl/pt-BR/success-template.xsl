<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="success-template">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="Banner da OpenText"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Bem-vindo ao OpenText Tempo!</b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Você está a apenas um clique de um compartilhamento seguro, fácil e rápido, com um toque profissional!</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- Try tempo now for 90 days... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempowebappurl"/></xsl:attribute>Comece a usar o OpenText Tempo agora!</a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- You're used to sharing... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Para garantir que seu conteúdo esteja sempre ao alcance de seus dedos, você provavelmente está acostumado a compartilhar arquivos por e-mail e mover seus documentos entre muitos dispositivos.  Tudo isso muda com o OpenText Tempo.  Com o OpenText Tempo, você pode sincronizar seu conteúdo de forma instantânea e automática com todos os seus computadores e dispositivos móveis.  Você também pode compartilhar informações facilmente com colegas em tempo real usando um navegador da Web.</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Use o OpenText Tempo em seu smartphone, tablet e computador com Windows:</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>iPhone e iPad: </b></td>
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
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempobbappurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempobbappurl"/></a></b> no navegador da Web de seu BlackBerry</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>Android:</b></td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></a></b> em seu dispositivo Android</td>
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
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">Quando for configurar seu cliente OpenText Tempo, use o seguinte endereço quando o URL do servidor for solicitado:</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempourl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempourl"/></a></b></td>
			</tr>

			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"> Observação: para redefinir ou alterar a senha de sua conta OpenText Tempo, use o seguinte link:</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/forgotpassword</xsl:template></td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
