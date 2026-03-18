import { X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewNavigation } from 'react-native-webview';

type Props = {
  paymentUrl: string;
  onSuccess: (bookingId: string) => void;
  onFailed: () => void;
  onCancel: () => void;
};

function extractBookingId(url: string): string {
  // Try query param: ?bookingId=xxx or &bookingId=xxx
  const qMatch = url.match(/[?&]bookingId=([^&#]+)/);
  if (qMatch?.[1]) return decodeURIComponent(qMatch[1]);
  // Fallback: path segment after "success/"
  const pMatch = url.match(/\/success\/([^/?&#]+)/);
  return pMatch?.[1] ? decodeURIComponent(pMatch[1]) : '';
}

export default function PaymentWebView({
  paymentUrl,
  onSuccess,
  onFailed,
  onCancel,
}: Props) {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const handledRef = useRef(false);

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url;
    if (!url || handledRef.current) return;

    if (url.includes('payment/success')) {
      handledRef.current = true;
      const bookingId = extractBookingId(url);
      onSuccess(bookingId);
      return;
    }

    if (url.includes('payment/failed') || url.includes('payment/cancel')) {
      handledRef.current = true;
      onFailed();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 text-center">
            Secure Payment
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCancelPress}
          activeOpacity={0.7}
          className="absolute right-4 w-9 h-9 items-center justify-center rounded-full bg-gray-100"
        >
          <X size={18} color="#374151" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          style={{ flex: 1 }}
        />

        {/* Loading overlay */}
        {loading && (
          <View className="absolute inset-0 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#5B4FE9" />
            <Text className="text-sm text-gray-400 mt-3">
              Loading payment page...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
