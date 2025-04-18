import { ref } from 'vue';

export interface ISimpleTableData {
  title: string;
  comment: string;
}

export interface IPaginatedTableData {
  id: number;
  picture: string;
  email: string;
  contact: number;
  name: string;
  role: string;
  created: string;
  level: string;
  levelColor: string;
}

export interface IWideTableData {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
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
      contact: 1012345678,
      role: '일반',
      created: 'Jan 21, 2020',
      level: 'bear',
      levelColor: 'blue',
    },
    { 
      id: 2,
      picture:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Blake Bowman',
      email: "blake@gmail.com",
      contact: 1012345678,
      role: '일반',
      created: 'Jan 01, 2020',
      level: 'bear',
      levelColor: 'blue',
    },
    { 
      id: 3,
      picture:
        'https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Dana Moore',
      email: "dana@gmail.com",
      contact: 1012345678,
      role: '일반',
      created: 'Jan 10, 2020',
      level: 'lizard',
      levelColor: 'green',
    },
    { 
      id: 4,
      picture:
        'https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80',
      name: 'Alonzo Cox',
      email: "alonzo@gmail.com",
      contact: 1012345678,
      role: '펫시터',
      created: 'Jan 18, 2020',
      level: 'lizard',
      levelColor: 'green',
    },
    { 
      id: 5,
      picture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Vera Carpenter',
      email: "vera@gmail.com",
      contact: 1012345678,
      role: '일반',
      created: 'Jan 21, 2020',
      level: 'bear',
      levelColor: 'blue',
    },
  ]);

  const wideTableData = ref<IWideTableData[]>(
    [...Array(10).keys()].map(() => ({
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Software Engineer',
      title2: 'Web dev',
      status: 'Active',
      role: 'Owner',
    }))
  );

  return {
    simpleTableData,
    paginatedTableData,
    wideTableData,
  };
}
