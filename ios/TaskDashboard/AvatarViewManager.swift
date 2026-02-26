import Foundation

@objc(AvatarViewManager)
class AvatarViewManager: RCTViewManager {
  
  override func view() -> UIView! {
    return AvatarView()
  }

  // Indica a React Native que este módulo debe ejecutarse en el Main Thread (UI)
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}