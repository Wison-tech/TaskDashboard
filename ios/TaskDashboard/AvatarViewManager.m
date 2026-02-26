/**
 * AVATAR VIEW MANAGER (Capa de Exportación - Objective-C)
 * * Registra el componente y sus propiedades en el Bridge de React Native.
 * * Este archivo actúa como el pegamento entre el código nativo y JS.
 */

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(AvatarViewManager, RCTViewManager)

/**
 * RCT_EXPORT_VIEW_PROPERTY:
 * Vincula la propiedad 'name' de JavaScript con la variable '@objc var name' en Swift.
 * React Native se encarga de llamar al 'didSet' automáticamente cuando la prop cambia.
 */
RCT_EXPORT_VIEW_PROPERTY(name, NSString)

@end