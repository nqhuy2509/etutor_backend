export const responseCode = {
    some_things_went_wrong: '0000',
    auth: {
        register: {
            user_already_exists: '1001',
            username_already_exists: '1002',
        },
        login: {
            invalid_credentials: '1003',
            user_is_not_verify: '1004',
            user_is_not_active: '1005',
            user_is_suspended: '1006',
        },
    },
};
