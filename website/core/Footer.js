/**
 * Copyright (c) The Libra Core Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const PropTypes = require('prop-types');
const React = require('react');

function SocialFooter(props) {
  const projectName = 'libra';
  const repoUrl = `https://github.com/${props.config.organizationName}/${
    projectName
  }`;
  const baseUrl = props.config.baseUrl;

  return (
    <div className="footerSection">
      <h5>Libra开发者社区</h5>
      <div className="social">
      <img className="button-img" src="https://img.learnblockchain.cn/qrcode/xiaona_qrcode2.jpeg" ></img>
        <a
          className="twitter-follow-button" // part of the https://buttons.github.io/buttons.js script in siteConfig.js
          href={""}
          data-show-count="false"
          aria-label="weixin">
          备注 "Libra" 加群
          
        </a>
      </div>
    </div>
  );
}

SocialFooter.propTypes = {
  config: PropTypes.object,
};

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {this.props.config.footerIcon && (
            <a href={this.props.config.baseUrl} className="nav-home">
              <img
                src={`${this.props.config.baseUrl}${
                  this.props.config.footerIcon
                }`}
                alt={this.props.config.title}
              />
            </a>
          )}
          <div className="footerSection">
            <h5>Learn About Libra</h5>
            <a href={this.docUrl('welcome-to-libra')}>Welcome to Libra</a>
            <a href={this.docUrl('libra-protocol')}>Libra Protocol</a>
            <a href={this.docUrl('the-libra-blockchain-paper')}>Libra Blockchain</a>
            <a href={this.docUrl('life-of-a-transaction')}>Life of a Transaction</a>
            <p />
          </div>
          <div className="footerSection">
          <h5>Try Libra Core </h5>
            <a href={this.docUrl('my-first-transaction')}>My First Transaction</a>
            <a href={this.docUrl('move-overview')}>Getting Started With Move</a>
          </div>
          <SocialFooter config={this.props.config} />
        </section>
        <section className="copyright">
          {this.props.config.copyright && (
            <span>{this.props.config.copyright}</span>
          )}{' '}
         Libra 中文文档 | 深入浅出区块链社区翻译，未经许可请勿转载 | &nbsp; 
         <script type="text/javascript" src="https://s22.cnzz.com/z_stat.php?id=1265946080&web_id=1265946080"></script>
        </section>
        
      </footer>
    );
  }
}

module.exports = Footer;
