#import <Cordova/CDVPlugin.h>

@interface IdleTimer : CDVPlugin

- (void) enable:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) disable:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
