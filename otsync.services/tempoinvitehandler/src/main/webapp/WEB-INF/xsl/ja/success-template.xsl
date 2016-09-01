<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="success-template">
		<table style="width=612px;max-width:612px;table-layout:fixed;margin:0px;padding:0px;border-style:none;border-width:0px;text-align:left;">
			<tr>
				<td style="width:612px;height:73px;border-style:none;border-width:0px;margin:0px;padding:0px;">
					<img src="{/tempoinvite/@fullbase}/media/ot/ot_email_header.jpg" alt="OpenText バナー"></img>
				</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>OpenText Tempo へようこそ!</b></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">1 回クリックするだけで、ビジネス上のヒントを安全かつ簡単に素早く共有することができます。</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- Try tempo now for 90 days... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempowebappurl"/></xsl:attribute>今すぐ OpenText Tempo を開始してください!</a></td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<!-- You're used to sharing... -->
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">コンテンツをいつでもすぐに使用できるようにするため、これまでは E メールによってファイルを共有したり、多数のデバイス間でドキュメントを移動させたりしてきました。  OpenText Tempo によって、従来の手順は大きく変化します。  OpenText Tempo を使用すれば、ご使用のすべてのコンピュータやモバイル デバイス間で、コンテンツを即座に自動的に同期することができます。  また、Web ブラウザから簡単にリアル タイムで同僚と情報を共有することも可能です。</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">OpenText Tempo は、スマートフォン、タブレット、および Windows デスクトップで利用できます。</td>
			</tr>
			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"><b>iPhone と iPad: </b></td>
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
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempoandroidurl"/></a></b> Android デバイスから</td>
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
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">OpenText Tempo クライアントを設定する際にサーバーの URL を入力するように求められたら、次のアドレスを入力してください。</td>
			</tr>
			<tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:12px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<b><a><xsl:attribute name="href"><xsl:value-of select="/tempoinvite/settings/@tempourl"/></xsl:attribute><xsl:value-of select="/tempoinvite/settings/@tempourl"/></a></b></td>
			</tr>

			<tr>
				<td style="width:612px;border-style:none;border-width:0px;margin:0px;padding:0px;">&#160;</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;"> 注意: OpenText Tempo アカウントのパスワードをリセットまたは変更する場合は、次のリンクを使用してください。</td>
			</tr>
            <tr>
				<td style="width:612px;font-family:Helvetica, Arial, Sans-Serif;font-size:10px;color:#000000;margin:0px;padding-left:18px;padding-right:36px;border-style:none;border-width:0px;">
				<xsl:template name="validation-link"><xsl:value-of select="/tempoinvite/@fullbase"/>/register/forgotpassword</xsl:template></td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
