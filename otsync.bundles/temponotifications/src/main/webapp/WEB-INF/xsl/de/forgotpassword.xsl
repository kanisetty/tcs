<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:output omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>	
	<xsl:include href="core.xsl"/>
	<xsl:variable name="pagetitle" select="'Kennwortrücksetzung'"/>
	<xsl:variable name="headertext" select="'Wir benötigen Ihren Benutzernamen. Daraufhin wird eine Kennwortrücksetzungsmeldung an Ihre E-Mail-Adresse gesendet.'"/>
	<xsl:template match="/">
		<html>
			<xsl:call-template name="head"><xsl:with-param name="title" select="$pagetitle"></xsl:with-param></xsl:call-template>
			<body class="yui-skin-sam">
				<div id="{$doc}" class="{$layout}">
					<xsl:call-template name="body-hd"><xsl:with-param name="hdrtext" select="$headertext"/><xsl:with-param name="hdrbranding" select="/tempoinvite/settings/@brandingheader"/></xsl:call-template>
					<div id="bd">
						<div id="yui-main">
							<div class="yui-g">
								<form id="forgotpasswordform" method="post" action="{$base}/register/sendpasswordreset" onsubmit="return false;">
									<div class="formdlg">
										<xsl:call-template name="form-top-step"><xsl:with-param name="step" select="'one'"></xsl:with-param></xsl:call-template>
										<div class="formdlgmiddle">
											<div id="form-err-msg" class="error">
												<xsl:choose>
													<xsl:when test="/tempoinvite/user/@username_missing_error">
														<xsl:value-of select="'Der Benutzername ist nicht vorhanden.'"/>
													</xsl:when>
													<xsl:when test="/tempoinvite/user/@user_error">
														<xsl:value-of select="'Füllen Sie alle erforderlichen Formularfelder aus.'"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="'&#160;'"/>
													</xsl:otherwise>
												</xsl:choose>
											</div>
										</div>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<div class="formdlgmiddle">
											<table cellpadding="0" cellmargin="0" class="formdlgfieldrow">
												<tr>
													<xsl:call-template name="form-field-input-col1">
														<xsl:with-param name="fldlabel" select="'Benutzername (E-Mail-Adresse)'"></xsl:with-param>
														<xsl:with-param name="fldid" select="''"></xsl:with-param>
														<xsl:with-param name="fldname" select="'username'"></xsl:with-param>
														<xsl:with-param name="fldvalue" select="/tempoinvite/user/@username"></xsl:with-param>
													</xsl:call-template>
													<xsl:call-template name="form-field-empty-input"/>
												</tr>
											</table>
										</div>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<xsl:call-template name="form-line-action">
											<xsl:with-param name="actionlabel" select="'Senden'"></xsl:with-param>
										</xsl:call-template>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<xsl:call-template name="form-bottom"></xsl:call-template>
										<xsl:call-template name="action-button-spinner"></xsl:call-template>
									</div>
									<xsl:call-template name="hidden-submit"></xsl:call-template>
								</form>		
							</div>
						</div>
					</div>
					<xsl:call-template name="body-ft"/>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
