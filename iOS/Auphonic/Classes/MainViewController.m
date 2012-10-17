/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  Auphonic
//
//  Created by Christoph Pojer on 7/13/12.
//  Copyright Christoph Pojer 2012. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // Set the main view to utilize the entire application frame space of the device.
    // Change this to suit your view's UI footprint needs in your application.

    UIView* rootView = [[[[UIApplication sharedApplication] keyWindow] rootViewController] view];
    CGRect webViewFrame = [[[rootView subviews] objectAtIndex:0] frame];  // first subview is the UIWebView

    if (CGRectEqualToRect(webViewFrame, CGRectZero)) { // UIWebView is sized according to its parent, here it hasn't been sized yet
        self.view.frame = [[UIScreen mainScreen] applicationFrame]; // size UIWebView's parent according to application frame, which will in turn resize the UIWebView
    }

    [super viewWillAppear:animated];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

/* Comment out the block below to over-ride */

/*
- (CDVCordovaView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:bounds];
}
*/

/* Comment out the block below to over-ride */

/*
#pragma CDVCommandDelegate implementation

- (id) getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (BOOL) execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

- (NSString*) pathForResource:(NSString*)resourcepath;
{
    return [super pathForResource:resourcepath];
}

- (void) registerPlugin:(CDVPlugin*)plugin withClassName:(NSString*)className
{
    return [super registerPlugin:plugin withClassName:className];
}
*/

#pragma UIWebDelegate implementation

- (void)webViewDidFinishLoad:(UIWebView*)theWebView
{
    // only valid if ___PROJECTNAME__-Info.plist specifies a protocol to handle
    /*if (self.invokeString) {
         // this is passed before the deviceready event is fired, so you can access it in js when you receive deviceready
         NSString* jsString = [NSString stringWithFormat:@"var invokeString = \"%@\";", self.invokeString];
         [theWebView stringByEvaluatingJavaScriptFromString:jsString];
    }*/
     
    // Black base color for background matches the native apps
    theWebView.backgroundColor = [UIColor blackColor];

    // This fixes *any* problem you'll ever have with -webkit-overflow-scrolling: touch
    UIScrollView *scrollView = (UIScrollView *)[[theWebView subviews] objectAtIndex:0];
    scrollView.scrollsToTop = NO;
    scrollView.scrollEnabled = NO;

    return [super webViewDidFinishLoad:theWebView];
}

/* Comment out the block below to over-ride */

/*

- (void) webViewDidStartLoad:(UIWebView*)theWebView
{
    return [super webViewDidStartLoad:theWebView];
}

- (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
{
    return [super webView:theWebView didFailLoadWithError:error];
}
*/

- (BOOL) webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    NSString *absolute = [url absoluteString];

    // This isn't pretty but it works.
    if (([absolute hasSuffix:@"!external"]) && [[UIApplication sharedApplication] canOpenURL:url]) {
        NSString *absolute1 = [absolute substringWithRange: NSMakeRange(0, absolute.length - 9)];
        if ([absolute1 hasSuffix:@"%23"]) { // Checks for urlencoded #
            NSURL *URL = [NSURL URLWithString:[absolute1 substringWithRange: NSMakeRange(0, absolute1.length - 3)]];
            [[UIApplication sharedApplication] openURL: URL];
        } else {
            NSURL *URL = [NSURL URLWithString:absolute1];
            [[UIApplication sharedApplication] openURL: URL];
        }

        return NO;
    }

    return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
}

@end
