export default [
	{path: "/login",component: r => require.ensure([], () => r(require("../view/login/login.vue").default.options),"login")},

	{path: "/my",component: r => require.ensure([], () => r(require("../view/my/my.vue").default.options),"my")},

	{path: "/user",component: r => require.ensure([], () => r(require("../view/user/user.vue").default.options),"user")},

	{path: "/list",component: r => require.ensure([], () => r(require("../view/list/list.vue").default.options),"list")},

	{path: "/",component: r => require.ensure([], () => r(require("../view/index/index.vue").default.options),"index")}
]