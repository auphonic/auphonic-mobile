//
//  EmailComposer.m
//
//  Version 1.1
//
//  Created by Guido Sabatini in 2012. Modified by @cpojer.
//

#define RETURN_CODE_EMAIL_CANCELLED 0
#define RETURN_CODE_EMAIL_SAVED 1
#define RETURN_CODE_EMAIL_SENT 2
#define RETURN_CODE_EMAIL_FAILED 3
#define RETURN_CODE_EMAIL_NOTSENT 4

#import "EmailComposer.h"
#import <MobileCoreServices/MobileCoreServices.h>

@implementation EmailComposer

@synthesize callbackId;

- (void) showEmailComposer:(CDVInvokedUrlCommand*)command {
  self.callbackId = command.callbackId;
  NSDictionary *parameters = [command.arguments objectAtIndex:0];
  [self showEmailComposerWithParameters:parameters];
}

- (void) showEmailComposerWithParameters:(NSDictionary*)parameters {

  MFMailComposeViewController *mailComposer = [[MFMailComposeViewController alloc] init];
  mailComposer.mailComposeDelegate = self;

  @try {
    NSString* subject = [parameters objectForKey:@"subject"];
    if (subject) [mailComposer setSubject:subject];
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set subject; error: %@", exception);
  }

  @try {
    NSString* body = [parameters objectForKey:@"body"];
    BOOL isHTML = [[parameters objectForKey:@"isHTML"] boolValue];
    if(body) [mailComposer setMessageBody:body isHTML:isHTML];
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set body; error: %@", exception);
  }

  @try {
    NSArray* toRecipientsArray = [parameters objectForKey:@"to"];
    if(toRecipientsArray) [mailComposer setToRecipients:toRecipientsArray];
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set TO recipients; error: %@", exception);
  }

  @try {
    NSArray* ccRecipientsArray = [parameters objectForKey:@"cc"];
    if(ccRecipientsArray) [mailComposer setCcRecipients:ccRecipientsArray];
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set CC recipients; error: %@", exception);
  }

  @try {
    NSArray* bccRecipientsArray = [parameters objectForKey:@"bcc"];
    if(bccRecipientsArray) [mailComposer setBccRecipients:bccRecipientsArray];
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set BCC recipients; error: %@", exception);
  }

  @try {
    int counter = 1;
    NSArray *attachmentPaths = [parameters objectForKey:@"attachments"];
    if (attachmentPaths) {
      for (NSString* path in attachmentPaths) {
        @try {
          NSData *data = [[NSFileManager defaultManager] contentsAtPath:path];
          [mailComposer addAttachmentData:data mimeType:[self getMimeTypeFromFileExtension:[path pathExtension]] fileName:[NSString stringWithFormat:@"attachment%d.%@", counter, [path pathExtension]]];
          counter++;
        }
        @catch (NSException *exception) {
          NSLog(@"Cannot attach file at path %@; error: %@", path, exception);
        }
      }
    }
  }
  @catch (NSException *exception) {
    NSLog(@"EmailComposer - Cannot set attachments; error: %@", exception);
  }

    if (mailComposer != nil) [self.viewController presentViewController:mailComposer animated:YES completion:nil];
  else [self executeCallback:RETURN_CODE_EMAIL_NOTSENT];
}


- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error {
  int code = 0;
  switch (result) {
    case MFMailComposeResultCancelled:
      code = RETURN_CODE_EMAIL_CANCELLED;
      break;
    case MFMailComposeResultSaved:
      code = RETURN_CODE_EMAIL_SAVED;
      break;
    case MFMailComposeResultSent:
      code = RETURN_CODE_EMAIL_SENT;
      break;
    case MFMailComposeResultFailed:
      code = RETURN_CODE_EMAIL_FAILED;
      break;
    default:
      code = RETURN_CODE_EMAIL_NOTSENT;
      break;
  }

  [controller dismissViewControllerAnimated:YES completion:nil];
  [self executeCallback:code];
}

- (void) executeCallback:(int)code {
  CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:code];
  [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
}

- (NSString *) getMimeTypeFromFileExtension:(NSString *)extension {
  if (!extension) return nil;
  CFStringRef pathExtension, type;
  pathExtension = (CFStringRef)CFBridgingRetain(extension);
  type = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension, NULL);
  return (NSString *)CFBridgingRelease(UTTypeCopyPreferredTagWithClass(type, kUTTagClassMIMEType));
}

@end
