import { ref } from 'vue';

export interface ISimpleTableData {
  title: string;
  comment: string;
}

export interface IPaginatedTableData {
  id: number;
  picture: string;
  email: string;
  contact: string;
  name: string;
  role: string;
  created: string;
  level: string;
  levelColor: string;
}

export interface IWideTableData {
  id: number;
  title: string;
  name: string;
  count: number;
  comments: number;
  createdAt: string;
}

export interface placeTableData {
  id: number;
  type: string;
  category: string;
  placeName: string;
  address: string;
  hours: {
    day: string;
    start: string;
    end: string;
  }[];
  contact: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export function useTableData() {
  const simpleTableData = ref<ISimpleTableData[]>([
    { title: '산책 같이 시키실 분', comment: '저요요' },
    { title: '우리 집 귀염둥이 햄찌를 소개합니다다', comment: '너무 귀여워요오' },
  ]);

  const paginatedTableData = ref<IPaginatedTableData[]>([
    { 
      id: 1,
      picture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Vera Carpenter',
      email: "vera@gmail.com",
      contact: "01012345678",
      role: '일반',
      created: 'Jan 21, 2020',
      level: 'Bear 🐻‍❄️',
      levelColor: 'indigo',
    },
    { 
      id: 2,
      picture:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Blake Bowman',
      email: "blake@gmail.com",
      contact: "01012345678",
      role: '일반',
      created: 'Jan 01, 2020',
      level: 'Otter 🦦',
      levelColor: 'blue',
    },
    { 
      id: 3,
      picture:
        'https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Dana Moore',
      email: "dana@gmail.com",
      contact: "01012345678",
      role: '일반',
      created: 'Jan 10, 2020',
      level: 'Dog 🐶',
      levelColor: 'green',
    },
    { 
      id: 4,
      picture:
        'https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80',
      name: 'Alonzo Cox',
      email: "alonzo@gmail.com",
      contact: "01012345678",
      role: '펫시터',
      created: 'Jan 18, 2020',
      level: 'Parrot 🦜',
      levelColor: 'yellow',
    },
    { 
      id: 5,
      picture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Vera Carpenter',
      email: "vera@gmail.com",
      contact: "01012345678",
      role: '일반',
      created: 'Jan 21, 2020',
      level: 'Lizard 🦎',
      levelColor: 'red',
    },
  ]);

  const wideTableData = ref<IWideTableData[]>(
    Array(10).fill(null).map((_, index) => ({
      id: index + 1,
      title: '안녕하세요 가입인사 드립니다',
      name: '코코',
      count: 10,
      comments: 2,
      createdAt: '2025-04-15',
    }))
  );

  const placeTableData = ref<placeTableData[]>(
    Array(9).fill(null).map((_, index) => ({
      id: index + 1,
      type: '병원',
      category: '양서류',
      placeName: '동물병원',
      address: '부산 남구 어쩌고',
      hours: [
        { day: "monday", start: "09:00", end: "18:00" },
        { day: "tuesday", start: "09:00", end: "18:00" },
        { day: "wednesday", start: "09:00", end: "18:00" },
        { day: "thursday", start: "09:00", end: "18:00" },
        { day: "friday", start: "09:00", end: "20:00" },
        { day: "saturday", start: "10:00", end: "16:00" },
        { day: "sunday", start: "휴무", end: "휴무" },
      ],
      contact: '051-000-0000',
      score: 2.5,
      createdAt: '',
      updatedAt: '',
      isDeleted: false
    }))
  );

  return {
    simpleTableData,
    paginatedTableData,
    wideTableData,
    placeTableData,
  };
}
