<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>	
	<xsl:include href="core.xsl"/>
	<xsl:include href="success-template.xsl"/>
	<xsl:variable name="pagetitle" select="'Tempo-uitnodiging - Account instellen'"/>
	<xsl:template match="/">
		<html>
			<xsl:call-template name="head"><xsl:with-param name="title" select="$pagetitle"></xsl:with-param></xsl:call-template>
			<body class="yui-skin-sam">
				<div id="{$doc}" class="{$layout}">
					<xsl:call-template name="body-hd-blank"><xsl:with-param name="hdrbranding" select="/tempoinvite/settings/@brandingheader"/></xsl:call-template>
					<div id="bd">
						<div id="yui-main">
							<div class="yui-g">
								<div class="formdlg">
									<xsl:call-template name="form-top-step"><xsl:with-param name="step" select="/tempoinvite/user/@showstep"></xsl:with-param></xsl:call-template>
									<xsl:call-template name="form-line-spacer"></xsl:call-template>
									<div class="formdlgmiddle">
										<div class="formdlgmessage">Dank u! Uw account is nu ingesteld en klaar voor gebruik. Er is een e-mail met uw accountgegevens en nuttige koppelingen verzonden naar</div>
										<div class="formdlgmessage" style="font-weight:bold;"><xsl:value-of select="/tempoinvite/user/@email"/></div>
									</div>
									<xsl:call-template name="form-line-spacer"></xsl:call-template>
									<xsl:call-template name="form-bottom"></xsl:call-template>
								</div>
							</div>
						</div>
					</div>
					<xsl:call-template name="body-ft"/>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
