import { UserBasic, UserProfile } from 'src/app/swagger-api';

export const mockUserBasic: UserProfile = {
    entityId: '9816cdc2bc03f67e0f6773ea623d36222d8f9200e8705d74ff5b2cf96fb0d22f',
    firstName: 'Roman',
    lastName: 'Doschich',
    phone: '1231231231',
    image:
        'https://media.licdn.com/dms/image/C5603AQFFcXbGDtS2EQ/profile-displayphoto-shrink_800_800/0/1552129341509?e=1720656000&v=beta&t=AkOC5XslKhk1WU_HLEOeGo8Ze1CGBvI5oBGoMhTZQXs',
    email: 'roman.doschich@gmail.com',
    address: 'Kharkiv, Ukraine',
    site: 'https://github.com/Mentor-kh',
    additionals: [
        {
            title: 'Position',
            info: 'Javascript Software Engineer',
        },
        {
            title: 'Summary',
            info: '• Over ten years of working experience developing web projects;<br> • Deep knowledge of HTML/CSS;<br> • 4+ years experience with Angular2+ <br> • Attentive to details team member player; <br> • Have huge experience with supporting long term big projects, from scratch to release;',
        },
        {
            title: 'Technical skills',
            info: '• Design patterns;<br> • Unit, Integration, E2E test coverage, TDD;<br> • Refactoring;<br> • Typescript;<br> • ngrx;<br> • OpenAPI; <br> • Reusable components and libraries;',
        },
        {
            title: 'Others',
            info: 'docker, aws, amplify, swagger, UML, twilio, gmaps, atlassian, sentry...',
        },
        {
            title: 'Education',
            info: '2002 – 2003: V.N. Karazin Kharkiv National University Mechanics and Mathematics, Mathematics specialty 2003 – 2007: National Aerospace University, Technology and telecommunications',
        },
        {
            title: 'Work Experience',
            info: '2019-07 - 2023-04 - Design and Test Lab: Javascript Software Engineer 2015-09 - 2019-03 - PSD2HTML: Team leader, front-end 2014 - 2015-09  – PSD2HTML: front-end developer 2009-04 - 2014  – PSD2HTML: markup developer 2007-2009 – National Aerospace University, (KNAU) Department of communication Communications Engineer 5 level',
        },
        {
            title: 'Foreign Languages',
            info: 'English: upper intermediate<br> Russian: native<br> Ukrainian: native',
        },
        {
            title: 'Additional',
            info: 'Ready for development of reliable javascript components, services, libraries; Strong precise team player member.',
        },
    ],
    password:
        '9c66aa7b7ab68e42f3d46057999539e5b230540938a3f64b13d2e75de08640c0',
};
