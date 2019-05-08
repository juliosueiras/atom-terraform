const {AutoLanguageClient} = require('atom-languageclient');
const cp = require('child_process')


class TerraformLanguageClient extends AutoLanguageClient {
  getGrammarScopes() { return ['source.terraform'] }
  getLanguageName() { return 'Terraform' }
  getServerName() { return 'Terraform LSP' }
  getConnectionType() { return 'stdio' }

  startServerProcess() {
    atom.config.set('core.debugLSP', true)
    console.log(atom.config.get('atom-terraform.commandPath'))
    this.logger.debug(`starting Terraform LSP`)
    const childProcess = cp.spawn(atom.config.get('atom-terraform.commandPath'), {cwd: require('path').dirname(atom.workspace.getActiveTextEditor().getPath()) })
    this.captureServerErrors(childProcess)
    childProcess.on('close', exitCode => {
      if (!childProcess.killed) {
    atom.notifications.addError('Terraform language server stopped unexpectedly.', {
      dismissable: true,
      description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${exitCode}`
    })
  }
})
return childProcess
  }

  preInitialization(connection) {
  connection.onLogMessage(e => {
    consoloe.log(e)
  });
  }

  provideAutocomplete() {
    const provide = super.provideAutocomplete();
    provide.select = this.getGrammarScopes().join(', ');
    provide.inclusionPriority = 2;
    provide.suggestionPriority = 2;
    provide.excludeLowerPriority = true;
    provide.filterSuggestions = true;
    return provide;
  }
}

module.exports = new TerraformLanguageClient()
