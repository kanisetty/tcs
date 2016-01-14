<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:variable name="media" select="/*/@media"/>
	<xsl:variable name="base" select="/*/@base"/>
	<xsl:variable name="doc" select="'doc3'"/>
	<xsl:variable name="layout" select="'yui-t7'"/>
	<xsl:template name="head-yui-include">
		<!-- Individual YUI CSS files --> 
		<link rel="stylesheet" type="text/css" href="{$media}/yui/reset-fonts-grids/reset-fonts-grids.css"/> 
		<link rel="stylesheet" type="text/css" href="{$media}/yui/base/base-min.css"/>
		<link rel="stylesheet" type="text/css" href="{$media}/tempoinvite.css"/>
		<!-- Individual YUI JS files --> 
		<script type="text/javascript" src="{$media}/yui/yahoo-dom-event/yahoo-dom-event.js">/**/</script>
		<script type="text/javascript" src="{$media}/tempoinvite.js">/**/</script>
	</xsl:template>
	<xsl:template name="head">
		<xsl:param name="title" select="'Convite para o Tempo'"/>
		<head>
			<title><xsl:value-of select="$title"/></title>
			<xsl:call-template name="head-yui-include"/>
		</head>
	</xsl:template>
	<xsl:template name="branding-hd">
		<xsl:param name="branding" select="'none'"/>
		<div class="defaultheader">
			<img src="{$media}/ot/tempo_wordmark.png" alt="Cabeçalho da marca"></img>
		</div>
	</xsl:template>	
	<xsl:template name="body-hd">
		<xsl:param name="hdrtext" select="'Convite para o Tempo'"/>
		<xsl:param name="hdrbranding" select="'none'"/>
		<div id="hd">
			<xsl:call-template name="branding-hd">
				<xsl:with-param name="branding" select="$hdrbranding"></xsl:with-param>
			</xsl:call-template>
		</div>
	</xsl:template>	
	<xsl:template name="body-hd-blank">
		<xsl:param name="hdrbranding" select="'none'"/>
		<div id="hd">
			<xsl:call-template name="branding-hd">
				<xsl:with-param name="branding" select="$hdrbranding"></xsl:with-param>
			</xsl:call-template>
		</div>
	</xsl:template>	
	<xsl:template name="body-ft">
		<div id="ft">
			<div class="footertext">
				<p>Copyright &#169; 2015 OpenText Corporation. Todos os direitos reservados.</p>
			</div>
		</div>
	</xsl:template>	
	<xsl:template name="policy">
		<a target="_blank" href="http://www.opentext.com/2/global/site-privacy.html">Política de privacidade da OpenText</a>
	</xsl:template>
	<xsl:template name="form-top-step">
		<xsl:param name="step" select="'none'"/>
		<div id="formdlgtop">
			<table>
				<tr>
					<td width="100%">
						<div class="formdlgtitle">
							<xsl:value-of select="$pagetitle"/>
						</div>
					</td>
					<td width="65px">
						<xsl:choose>
							<xsl:when test="$step = 'one'">
								<div class="formdlgstep">
									<img src="{$media}/ot/step_01.png" alt="Etapa 1"></img>
								</div>
							</xsl:when>
							<xsl:when test="$step = 'two'">
								<div class="formdlgstep">
									<img src="{$media}/ot/step_02.png" alt="Etapa 2"></img>
								</div>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="'&#160;'"/>
							</xsl:otherwise>
						</xsl:choose>
					</td>
					<td width="35px">&#160;</td>
				</tr>
			</table>
		</div>
	</xsl:template>
	<xsl:template name="form-bottom">
		<div class="formdlgbottom">&#160;</div>
	</xsl:template>
	<xsl:template name="form-line-spacer">
		<div class="formdlgmiddle">&#160;</div>
	</xsl:template>
	<xsl:template name="form-field-input-col1">
		<xsl:param name="fldlabel" select="'Título do campo'"/>
		<xsl:param name="fldid" select="'field-id'"/>
		<xsl:param name="fldname" select="'fieldname'"/>
		<xsl:param name="fldvalue" select="'fieldvalue'"/>
		<xsl:param name="fldtype" select="'text'"/>
		<xsl:param name="flddisplayonly" select="'false'"/>
		<td class="formdlgfieldset">
			<div class="fieldlabelcol1"><xsl:value-of select="$fldlabel"/></div>
			<div class="fieldinputcol1">
				<table cellmargin="0px" cellpadding="0px" class="fieldinputrow">
					<tr>
						<xsl:choose>
							<xsl:when test="$flddisplayonly = 'true'">
								<div class="fielddisplayonly">
									<xsl:attribute name="id"><xsl:value-of select="$fldid"/></xsl:attribute>
									<xsl:attribute name="name"><xsl:value-of select="$fldname"/></xsl:attribute>
									<xsl:value-of select="$fldvalue"/>
								</div>
							</xsl:when>
							<xsl:otherwise>
								<td class="fieldinputleft"></td>
								<td class="fieldinputmiddle">
									<input class="fieldinputentry">
										<xsl:attribute name="id"><xsl:value-of select="$fldid"/></xsl:attribute>
										<xsl:attribute name="name"><xsl:value-of select="$fldname"/></xsl:attribute>
										<xsl:attribute name="value"><xsl:value-of select="$fldvalue"/></xsl:attribute>
										<xsl:attribute name="type"><xsl:value-of select="$fldtype"/></xsl:attribute>
									</input>
								</td>
								<td class="fieldinputright"></td>
							</xsl:otherwise>
						</xsl:choose>
					</tr>
				</table>
			</div>
		</td>
	</xsl:template>
	<xsl:template name="form-field-input-col2">
		<xsl:param name="fldlabel" select="'Título do campo'"/>
		<xsl:param name="fldid" select="'field-id'"/>
		<xsl:param name="fldname" select="'fieldname'"/>
		<xsl:param name="fldvalue" select="'fieldvalue'"/>
		<xsl:param name="fldtype" select="'text'"/>
		<xsl:param name="flddisplayonly" select="'false'"/>
		<td class="formdlgfieldset">
			<div class="fieldlabelcol2"><xsl:value-of select="$fldlabel"/></div>
			<div class="fieldinputcol2">
				<table cellmargin="0px" cellpadding="0px" class="fieldinputrow">
					<tr>
						<xsl:choose>
							<xsl:when test="$flddisplayonly = 'true'">
								<div class="fielddisplayonly">
									<xsl:attribute name="id"><xsl:value-of select="$fldid"/></xsl:attribute>
									<xsl:attribute name="name"><xsl:value-of select="$fldname"/></xsl:attribute>
									<xsl:value-of select="$fldvalue"/>
								</div>
							</xsl:when>
							<xsl:otherwise>
								<td class="fieldinputleft"></td>
								<td class="fieldinputmiddle">
									<input class="fieldinputentry">
										<xsl:attribute name="id"><xsl:value-of select="$fldid"/></xsl:attribute>
										<xsl:attribute name="name"><xsl:value-of select="$fldname"/></xsl:attribute>
										<xsl:attribute name="value"><xsl:value-of select="$fldvalue"/></xsl:attribute>
										<xsl:attribute name="type"><xsl:value-of select="$fldtype"/></xsl:attribute>
									</input>
								</td>
								<td class="fieldinputright"></td>
							</xsl:otherwise>
						</xsl:choose>
					</tr>
				</table>
			</div>
		</td>
	</xsl:template>
	<xsl:template name="form-field-empty-input">
		<td class="formdlgfieldset">&#160;</td>
	</xsl:template>
	<xsl:template name="form-line-action">
		<xsl:param name="actionlabel" select="'Título da ação'"/>
		<div class="formdlgmiddle">
			<table cellpadding="0" cellmargin="0" class="formdlgfieldrow">
				<tr>
					<td class="privacypolicy">
					</td>
					<td align="right" class="actionbuttoncell">
						<xsl:call-template name="action-button">
							<xsl:with-param name="btnlabel" select="$actionlabel"></xsl:with-param>
						</xsl:call-template>
					</td>
				</tr>
			</table>
		</div>
	</xsl:template>
	<xsl:template name="action-button">
		<xsl:param name="btnlabel" select="'Título do botão'"/>
		<table class="actionbutton">
			<tr>
				<td class="actionbuttonleft">&#160;</td>
				<td class="actionbuttonmiddle">
					<div id="action-btn-label" class="actionbuttonlabel" onclick="javascript:validate(document.forms[0]);" onselectstart="return false;">
						&#160;&#160;<xsl:value-of select="$btnlabel"/>&#160;&#160;
					</div>
				</td>
				<td class="actionbuttonright">&#160;</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template name="action-button-spinner">
		<div id="action-btn-spinner" class="actionbtnspinner" onselectstart="return false;">
			<img src="{$media}/ot/loader.gif" alt="Ícone de ocupado"></img>
		</div>
	</xsl:template>
	<xsl:template name="hidden-submit">
		<div id="hidden-submit" class="hiddensubmit">
			<input type="submit" onclick="javascript:validate(document.forms[0]);"/>
		</div>
	</xsl:template>
</xsl:stylesheet>