import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, UserInfo } from '@src/services/api';
import { userStorage } from '@src/utils/storage';
import { getFirstPinyin, getFullPinyin } from '@src/utils/pinyin';
import Avatar from '@src/components/Avatar';
import TabBar from '@src/components/TabBar';
import styles from './style.module.css';

interface GroupedUsers {
  [key: string]: UserInfo[];
}

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUsers>({});
  const [sections, setSections] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 检查登录状态
  const phone = userStorage.getPhone() || '';

  // 获取昵称的首字母（大写）
  const getInitial = (nickname: string): string => {
    return getFirstPinyin(nickname);
  };

  // 处理快捷方式点击
  const handleQuickJump = (section: string) => {
    const element = sectionRefs.current[section];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 处理用户点击
  const handleUserClick = async (user: UserInfo) => {
    try {
      const response = await apiService.createOrGetConversation(user.phone);
      if (response.success) {
        navigate(`/chat/${user.phone}`);
      }
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.getAllUsers();
        if (response.success && response.data) {
          // 过滤掉当前用户
          const otherUsers = response.data.filter(user => user.phone !== phone);
          setUsers(otherUsers);

          // 按首字母分组
          const grouped: GroupedUsers = {};
          otherUsers.forEach(user => {
            const initial = getInitial(user.nickname || '');
            if (!grouped[initial]) {
              grouped[initial] = [];
            }
            grouped[initial].push(user);
          });

          // 对每个分组内的用户按昵称拼音排序
          Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => 
              getFullPinyin(a.nickname || '').localeCompare(getFullPinyin(b.nickname || ''))
            );
          });

          // 获取所有分组并排序（字母 -> 数字 -> #）
          const allSections = Object.keys(grouped).sort((a, b) => {
            // 特殊字符 # 始终放在最后
            if (a === '#') return 1;
            if (b === '#') return -1;
            
            // 判断是否为数字
            const aIsNumber = /^\d$/.test(a);
            const bIsNumber = /^\d$/.test(b);
            
            // 如果都是数字，按数字大小排序
            if (aIsNumber && bIsNumber) {
              return parseInt(a) - parseInt(b);
            }
            
            // 如果只有一个是数字，数字放在后面
            if (aIsNumber) return 1;
            if (bIsNumber) return -1;
            
            // 其他情况（字母）按字母表顺序排序
            return a.localeCompare(b);
          });

          setGroupedUsers(grouped);
          setSections(allSections);
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [phone]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        通讯录
        <div className={styles.addContact}>+</div>
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <>
            <div className={styles.userList}>
              {sections.map(section => (
                <div 
                  key={section}
                  ref={el => sectionRefs.current[section] = el}
                  className={styles.section}
                >
                  <div className={styles.sectionHeader}>{section}</div>
                  {groupedUsers[section].map(user => (
                    <div 
                      key={user.phone} 
                      className={styles.userItem}
                      onClick={() => handleUserClick(user)}
                    >
                      <Avatar nickname={user.nickname} avatarUrl={user.avatarUrl} size={40} />
                      <div className={styles.userInfo}>
                        <div className={styles.nickname}>{user.nickname}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.quickJump}>
              {sections.map(section => (
                <div
                  key={section}
                  className={styles.quickJumpItem}
                  onClick={() => handleQuickJump(section)}
                >
                  {section}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <TabBar />
    </div>
  );
};

export default ContactsPage; 