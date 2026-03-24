package com.aeddi.app;

import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.webkit.WebView;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;

import androidx.activity.OnBackPressedCallback;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    private ImageView splashView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        new WindowInsetsControllerCompat(
                getWindow(), getWindow().getDecorView()
        ).setAppearanceLightNavigationBars(true);

        WebView webView = this.bridge.getWebView();
        webView.setBackgroundColor(Color.TRANSPARENT);

        // Splash screen
        splashView = new ImageView(this);
        splashView.setBackgroundColor(Color.WHITE);
        splashView.setScaleType(ImageView.ScaleType.FIT_CENTER);
        splashView.setImageResource(R.drawable.splash);

        FrameLayout layout = findViewById(android.R.id.content);
        layout.addView(splashView);

        webView.setWebViewClient(new BridgeWebViewClient(this.bridge) {

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                splashView.postDelayed(() -> {
                    splashView.setVisibility(View.GONE);
                }, 2000);
            }

            @Override
            public void onReceivedError(WebView view,
                                        WebResourceRequest request,
                                        WebResourceError error) {
                super.onReceivedError(view, request, error);

                if (request.isForMainFrame()) {

                    String html =
                            "<html><body style='background:#1a1a2e;display:flex;" +
                                    "flex-direction:column;align-items:center;justify-content:center;" +
                                    "height:100vh;margin:0;font-family:sans-serif;text-align:center;padding:20px'>" +

                                    "<div style='font-size:80px'>📡</div>" +
                                    "<h2 style='color:#fff;margin-top:20px'>Pas de connexion</h2>" +
                                    "<p style='color:#aaa'>Vérifie ta connexion internet et réessaie.</p>" +
                                    "</body></html>";

                    view.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
                }
            }
        });

        // Gestion bouton retour Android
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = bridge.getWebView();
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });
    }
}