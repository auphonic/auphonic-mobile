#import <Cordova/CDVPlugin.h>

@interface IdleTimer : CDVPlugin

- (void) enable:(CDVInvokedUrlCommand*)command;
- (void) disable:(CDVInvokedUrlCommand*)command;

@end
