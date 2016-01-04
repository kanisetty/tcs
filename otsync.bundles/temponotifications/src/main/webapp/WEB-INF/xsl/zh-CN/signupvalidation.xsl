<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>	
	<xsl:include href="core.xsl"/>
	<xsl:variable name="pagetitle" select="'Tempo 邀请帐户设置'"/>
	<xsl:variable name="headertext" select="'操作即将完成。 现在您要做的是设置您的用户名和密码。'"/>
	<xsl:template match="/">
		<html>
			<xsl:call-template name="head"><xsl:with-param name="title" select="$pagetitle"></xsl:with-param></xsl:call-template>
			<body class="yui-skin-sam">
				<div id="{$doc}" class="{$layout}">
					<xsl:call-template name="body-hd"><xsl:with-param name="hdrtext" select="$headertext"/><xsl:with-param name="hdrbranding" select="/tempoinvite/settings/@brandingheader"/></xsl:call-template>
					<div id="bd">
						<div id="yui-main">
							<div class="yui-g">
								<form id="signupvalidation" method="post" action="{$base}/register/create" onsubmit="return false;">
									<input type="hidden" name="invitationtoken" value="{/tempoinvite/user/@invitationtoken}"/>
									<div class="formdlg">
										<xsl:call-template name="form-top-step"><xsl:with-param name="step" select="/tempoinvite/user/@showstep"></xsl:with-param></xsl:call-template>
										<div class="formdlgmiddle">
											<div id="form-err-msg" class="error">
												<xsl:choose>
													<xsl:when test="/tempoinvite/user/@webservice_error">
														<xsl:value-of select="/tempoinvite/user/@webservice_error_message"/>
													</xsl:when>
													<xsl:when test="/tempoinvite/user/@token_already_used">
														<xsl:value-of select="'您已经用此电子邮件链接进行了注册。'"/>
													</xsl:when>
													<xsl:when test="/tempoinvite/user/@password_confirm_error">
														<xsl:value-of select="'请确保密码一致。'"/>
													</xsl:when>
													<xsl:when test="/tempoinvite/user/@username_exists_error">
														<xsl:value-of select="'很抱歉，该用户名已被使用。 请选择另一个用户名。'"/>
													</xsl:when>
													<xsl:when test="/tempoinvite/user/@user_error">
														<xsl:value-of select="'请填写所有字段。 密码必须至少包含 6 个字符。'"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="'&#160;'"/>
													</xsl:otherwise>
												</xsl:choose>
											</div>
										</div>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<xsl:if test="not(/tempoinvite/user/@token_already_used)">
											<div class="formdlgmiddle">
												<div class="formdlginstruction">密码必须至少包含 6 个字符，区分大小写。 密码必须至少包含 1 个数字。</div>
											</div>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<div class="formdlgmiddle">
												<table cellpadding="0" cellmargin="0" class="formdlgfieldrow">
													<tr>
														<xsl:call-template name="form-field-input-col1">
															<xsl:with-param name="fldlabel" select="'用户名'"></xsl:with-param>
															<xsl:with-param name="fldid" select="''"></xsl:with-param>
															<xsl:with-param name="fldname" select="'username'"></xsl:with-param>
															<xsl:with-param name="fldvalue" select="/tempoinvite/user/@username"></xsl:with-param>
															<xsl:with-param name="flddisplayonly" select="'true'"></xsl:with-param>
														</xsl:call-template>
														<xsl:call-template name="form-field-empty-input"></xsl:call-template>
													</tr>
												</table>
											</div>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<div class="formdlgmiddle">
												<table cellpadding="0" cellmargin="0" class="formdlgfieldrow">
													<tr>
														<xsl:call-template name="form-field-input-col1">
															<xsl:with-param name="fldlabel" select="'密码'"></xsl:with-param>
															<xsl:with-param name="fldid" select="''"></xsl:with-param>
															<xsl:with-param name="fldname" select="'password'"></xsl:with-param>
															<xsl:with-param name="fldvalue" select="/tempoinvite/user/@password"></xsl:with-param>
															<xsl:with-param name="fldtype" select="'password'"></xsl:with-param>
														</xsl:call-template>
														<xsl:call-template name="form-field-input-col2">
															<xsl:with-param name="fldlabel" select="'确认密码'"></xsl:with-param>
															<xsl:with-param name="fldid" select="''"></xsl:with-param>
															<xsl:with-param name="fldname" select="'password_confirm'"></xsl:with-param>
															<xsl:with-param name="fldvalue" select="/tempoinvite/user/@password_confirm"></xsl:with-param>
															<xsl:with-param name="fldtype" select="'password'"></xsl:with-param>
														</xsl:call-template>
													</tr>
												</table>
											</div>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<div class="formdlgmiddle">
												<table cellpadding="0" cellmargin="0" class="formdlgfieldrow">
													<tr>
														<xsl:call-template name="form-field-input-col1">
															<xsl:with-param name="fldlabel" select="'名字'"></xsl:with-param>
															<xsl:with-param name="fldid" select="''"></xsl:with-param>
															<xsl:with-param name="fldname" select="'firstname'"></xsl:with-param>
															<xsl:with-param name="fldvalue" select="/tempoinvite/user/@firstname"></xsl:with-param>
														</xsl:call-template>
														<xsl:call-template name="form-field-input-col2">
															<xsl:with-param name="fldlabel" select="'姓氏'"></xsl:with-param>
															<xsl:with-param name="fldid" select="''"></xsl:with-param>
															<xsl:with-param name="fldname" select="'lastname'"></xsl:with-param>
															<xsl:with-param name="fldvalue" select="/tempoinvite/user/@lastname"></xsl:with-param>
														</xsl:call-template>
													</tr>
												</table>
											</div>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<xsl:call-template name="form-line-spacer"></xsl:call-template>
											<xsl:call-template name="form-line-action">
												<xsl:with-param name="actionlabel" select="'创建帐户'"></xsl:with-param>
											</xsl:call-template>
										</xsl:if>
										<xsl:call-template name="form-line-spacer"></xsl:call-template>
										<xsl:call-template name="form-bottom"></xsl:call-template>
										<xsl:call-template name="action-button-spinner"></xsl:call-template>
									</div>
									<xsl:if test="not(/tempoinvite/user/@token_already_used)">
										<xsl:call-template name="hidden-submit"></xsl:call-template>
									</xsl:if>
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
