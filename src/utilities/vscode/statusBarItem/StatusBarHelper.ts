import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
} from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/constants'
import { SettingConfigurationService } from '@app/services'
import { createErrorNotification } from '@app/utilities/node'

export default class StatusBarHelper {
  private static _instance: StatusBarHelper
  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext) {
    try {
      const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
      statusBarItem.name = 'vscode-openai'
      statusBarItem.command = VSCODE_OPENAI_REGISTER.SERVICE_COMMAND_ID
      statusBarItem.backgroundColor = new ThemeColor(
        'statusBarItem.errorBackground'
      )
      context.subscriptions.push(statusBarItem)
      StatusBarHelper._instance = new StatusBarHelper(statusBarItem)
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): StatusBarHelper {
    return StatusBarHelper._instance
  }

  public async showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${SettingConfigurationService.instance.host} ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }

  public async showStatusBarWarning(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined)
      hostname = SettingConfigurationService.instance.host

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.warningBackground'
    )
    this.statusBarItem.show()
  }

  public async showStatusBarError(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined)
      hostname = SettingConfigurationService.instance.host

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    this.statusBarItem.show()
  }
}
