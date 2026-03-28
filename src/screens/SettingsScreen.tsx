import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');

  const SettingItem = ({ icon, title, value, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: '#eef2ff' }]}>  
          <Ionicons name={icon} size={20} color="#6366f1" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {value && <Text style={styles.settingValue}>{value}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  const ToggleSetting = ({ icon, title, value, onToggle }: any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: '#eef2ff' }]}>  
          <Ionicons name={icon} size={20} color="#6366f1" />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات والتذكيرات</Text>
        <ToggleSetting
          icon="notifications"
          title="تفعيل الإشعارات"
          value={notifications}
          onToggle={setNotifications}
        />
        <ToggleSetting
          icon="alarm"
          title="تذكير يومي"
          value={dailyReminder}
          onToggle={setDailyReminder}
        />
        <SettingItem
          icon="time"
          title="وقت التذكير"
          value={reminderTime}
          onPress={() => Alert.alert('وقت التذكير', 'اختر الوقت المفضل')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التخصيص</Text>
        <ToggleSetting
          icon="moon"
          title="المظهر الداكن"
          value={darkMode}
          onToggle={setDarkMode}
        />
        <SettingItem
          icon="language"
          title="اللغة"
          value="العربية"
          onPress={() => Alert.alert('اللغة', 'العربية')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>البيانات والخصوصية</Text>
        <SettingItem
          icon="cloud-download"
          title="مزامنة البيانات"
          onPress={() => Alert.alert('مزامنة', 'تم مزامنة البيانات بنجاح')}
        />
        <SettingItem
          icon="trash"
          title="حذف جميع البيانات"
          onPress={() =>
            Alert.alert(
              'تحذير',
              'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء',
              [
                { text: 'إلغاء', onPress: () => {} },
                { text: 'حذف', onPress: () => Alert.alert('تم حذف البيانات') },
              ]
            )
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حول التطبيق</Text>
        <SettingItem
          icon="information-circle"
          title="إصدار التطبيق"
          value="1.0.0"
          onPress={() => {}}
        />
        <SettingItem
          icon="help-circle"
          title="المساعدة والدعم"
          onPress={() => Alert.alert('الدعم', 'تم إرسال بريد إلى فريق الدعم')}
        />
        <SettingItem
          icon="document-text"
          title="سياسة الخصوصية"
          onPress={() => Alert.alert('سياسة الخصوصية', 'اطلع على الشروط والأحكام')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 12,
    color: '#9ca3af',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
