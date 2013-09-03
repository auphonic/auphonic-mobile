//
//  EmailComposer.h
//
//  Version 1.1
//
//  Created by Guido Sabatini in 2012. Modified by @cpojer.
//

#import <Foundation/Foundation.h>
#import <MessageUI/MFMailComposeViewController.h>
#import <Cordova/CDVPlugin.h>


@interface EmailComposer : CDVPlugin <MFMailComposeViewControllerDelegate>

- (void) showEmailComposer:(CDVInvokedUrlCommand*)command;
- (void) showEmailComposerWithParameters:(NSDictionary*)parameters;
- (void) mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error;
- (void) executeCallback:(int)code;
- (NSString *) getMimeTypeFromFileExtension:(NSString *)extension;

@property (nonatomic, copy) NSString* callbackId;

@end
