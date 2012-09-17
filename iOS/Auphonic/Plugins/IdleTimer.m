#import "IdleTimer.h"

@implementation IdleTimer

- (void)enable:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
  [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
}

- (void)disable:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
  [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
}

@end
