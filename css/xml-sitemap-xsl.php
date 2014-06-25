<?php
/**
 * @package XML_Sitemaps
 */

// This is to prevent issues with New Relics stupid auto injection of code. It's ugly but I don't want
// to deal with support requests for other people's wrong code...
if ( extension_loaded( 'newrelic' ) && function_exists( 'newrelic_disable_autorum' ) ) {
	newrelic_disable_autorum();
}

$xsl = '<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
				xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body {
						font-family: Helvetica, Arial, sans-serif;
						font-size: 13px;
						color: #545353;
					}
					table {
						border: none;
						border-collapse: collapse;
					}
					#sitemap tr.odd td {
						background-color: #eee !important;
					}
					#sitemap tbody tr:hover td {
						background-color: #ccc;
					}
					#sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
						color: #000;
					}
					#content {
						margin: 0 auto;
						width: 1000px;
					}
					.expl {
						margin: 18px 3px;
						line-height: 1.2em;
					}
					.expl a {
						color: #da3114;
						font-weight: bold;
					}
					.expl a:visited {
						color: #da3114;
					}
					a {
						color: #000;
						text-decoration: none;
					}
					a:visited {
						color: #777;
					}
					a:hover {
						text-decoration: underline;
					}
					td {
						font-size:11px;
					}
					th {
						text-align:left;
						padding-right:30px;
						font-size:11px;
					}
					thead th {
						border-bottom: 1px solid #000;
						cursor: pointer;
					}
				</style>
			</head>
			<body>
				<div id="content">
					<h1>XML Sitemap</h1>
					<p class="expl">
						Generated by <a href="https://yoast.com/">Yoast</a>\'s <a href="https://yoast.com/wordpress/plugins/seo/">WordPress SEO plugin</a>, this is an XML Sitemap, meant for consumption by search engines.<br/>
						You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.
					</p>
					<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
						<p class="expl">
							This XML Sitemap Index file contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.
						</p>
						<table id="sitemap" cellpadding="3">
							<thead>
								<tr>
									<th width="75%">Sitemap</th>
									<th width="25%">Last Modified</th>
								</tr>
							</thead>
							<tbody>
							<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
								<xsl:variable name="sitemapURL">
									<xsl:value-of select="sitemap:loc"/>
								</xsl:variable>
								<tr>
									<td>
										<a href="{$sitemapURL}"><xsl:value-of select="sitemap:loc"/></a>
									</td>
									<td>
										<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(\' \', substring(sitemap:lastmod,12,5)))"/>
									</td>
								</tr>
							</xsl:for-each>
							</tbody>
						</table>
					</xsl:if>
					<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
						<p class="expl">
							This XML Sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
						</p>
						<p class="expl"><a href="' . esc_url( home_url( 'sitemap_index.xml' ) ) . '">&#8593; Sitemap Index</a></p>
						<table id="sitemap" cellpadding="3">
							<thead>
								<tr>
									<th width="75%">URL</th>
									<th title="Index Priority" width="5%">Prio</th>
									<th width="5%">Images</th>
									<th title="Change Frequency" width="5%">Ch. Freq.</th>
									<th title="Last Modification Time" width="10%">Last Mod.</th>
								</tr>
							</thead>
							<tbody>
								<xsl:variable name="lower" select="\'abcdefghijklmnopqrstuvwxyz\'"/>
								<xsl:variable name="upper" select="\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\'"/>
								<xsl:for-each select="sitemap:urlset/sitemap:url">
									<tr>
										<td>
											<xsl:variable name="itemURL">
												<xsl:value-of select="sitemap:loc"/>
											</xsl:variable>
											<a href="{$itemURL}">
												<xsl:value-of select="sitemap:loc"/>
											</a>
										</td>
										<td>
											<xsl:value-of select="concat(sitemap:priority*100,\'%\')"/>
										</td>
										<td>
											<xsl:value-of select="count(image:image)"/>
										</td>
										<td>
											<xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1),concat($lower, $upper),concat($upper, $lower)),substring(sitemap:changefreq, 2))"/>
										</td>
										<td>
											<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(\' \', substring(sitemap:lastmod,12,5)))"/>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</xsl:if>
				</div>
				<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
				<script type="text/javascript" src="' . plugins_url( 'js/jquery.tablesorter.min.js', WPSEO_FILE ) . '"></script>
				<script	type="text/javascript"><![CDATA[
					$(document).ready(function() {
				        $("#sitemap").tablesorter( { widgets: [\'zebra\'] } );
					});
				]]></script>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>';
echo $xsl;
