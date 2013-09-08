#import "IdleTimer.h"

@implementation IdleTimer

- (void)enable:(CDVInvokedUrlCommand*)command {
  [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
}

- (void)disable:(CDVInvokedUrlCommand*)command {
  [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
}

@end
