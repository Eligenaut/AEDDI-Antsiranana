package com.aeddi.app;

import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import android.webkit.WebView;
import androidx.core.view.WindowInsetsControllerCompat;

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

        splashView = new ImageView(this);
        splashView.setBackgroundColor(Color.WHITE);
        splashView.setScaleType(ImageView.ScaleType.FIT_CENTER);
        splashView.setImageResource(R.drawable.splash);

        FrameLayout layout = findViewById(android.R.id.content);
        layout.addView(splashView);

        webView.setWebViewClient(new BridgeWebViewClient(this.bridge) {
            @Override
            public void onPageFinished(android.webkit.WebView view, String url) {
                super.onPageFinished(view, url);
                splashView.postDelayed(() -> {
                    splashView.setVisibility(View.GONE);
                }, 2000);
            }
        });

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