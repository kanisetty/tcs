<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:include href="core.xsl"/>
	<xsl:variable name="pagetitle" select="'[PAGETITLE]'"/>
	<xsl:template match="/">
		<html>
			<xsl:call-template name="head"><xsl:with-param name="title" select="$pagetitle"></xsl:with-param></xsl:call-template>
			<body class="yui-skin-sam">
				<div id="{$doc}" class="{$layout}">
					<xsl:call-template name="body-hd"><xsl:with-param name="hdrtext" select="$pagetitle"></xsl:with-param></xsl:call-template>
					<div id="bd">
						<div id="yui-main">
							<div class="yui-b">
								Primary Content			
							</div>
						</div>
						<div class="yui-b">
							Navigation Content
						</div>
					</div>
					<xsl:call-template name="body-ft"/>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
