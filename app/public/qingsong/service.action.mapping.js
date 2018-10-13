//URI 线上北总，上研，深研是2，8，9
jQuery.extend({
    getWorkflowMyArchiveActionURL: function (portalInfoId, servicename) {
        var map = {
            'pid2': {
                '北京工作居住证': '/myarchive/content_workpermit.do',
                '社会保险': '/myarchive/content_hospital.do',
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '住房公积金': '/myarchive/content_accumulationfund.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do',
                '证明开具': '/myarchive/content_certificate.do',
                '公司档案借阅': '/myarchive/content_personarchives.do',
                '双外住房补贴': '/myarchive/content_subside.do',
                '留学人员服务': '/myarchive/content_lxworkpermit.do',
                '档案管理': '/myarchive/content_record.do'

            },
            'pid3': {
                '证明开具': '/myarchive/content_certificate.do',
                '生育保险': '/myarchive/content_hospital.do',
                '医疗保险': '/myarchive/content_hospital.do',
                '住房公积金': '/myarchive/content_accumulationfund.do'
            },
            'pid4': {
                '证明开具': '/myarchive/content_certificate.do'
            },
            'pid5': {
                '证明开具': '/myarchive/content_certificate.do'
            },
            'pid6': {
                '证明开具': '/myarchive/content_certificate.do'
            },
            'pid7': {
                '证明开具': '/myarchive/content_certificate.do'
            },
            'pid8': {
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '上海居住证积分': '/myarchive/content_shworkpermit.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do',
                '双外住房补贴': '/myarchive/content_subside.do'
            },
            'pid9': {
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '应届生落户': '/myarchive/content_szgraduatesSettle.do',
                '工作居住证办理': '/myarchive/content_szworkpermit.do',
                '社会保险': '/myarchive/content_szbirthallowance.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do',
                '双外住房补贴': '/myarchive/content_subside.do',
                '社招调户': '/myarchive/content_szsettled.do'
            },
            'pid10': {
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do'
            },
            'pid11': {
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do'
            },
            'pid12': {
                '礼品卡/慰问金': '/myarchive/content_welfarecard.do',
                '商业医疗保险': '/myarchive/content_insurancefamily.do',
                '双外住房补贴': '/myarchive/content_subside.do'
            },
            'pid14': {
                '证明开具': '/myarchive/content_certificate.do'
            }

        };

        // return eval('map.pid'+portalInfoId+'.'+servicename);
        return map['pid' + portalInfoId][servicename];
    },

    getWorkflowImHRActionURL: function (portalInfoId, servicename) {
        var map = {
            'pid2': {
                '北京工作居住证': '/workflow/content_workpermit.do',
                '社会保险': '/workflow/content_hospital.do',
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '住房公积金': '/workflow/content_accumulationfund.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do',
                '证明开具': '/workflow/content_certificate.do',
                '公司档案借阅': '/workflow/content_personarchives.do',
                '双外住房补贴': '/workflow/content_subside.do',
                '留学人员服务': '/workflow/content_lxworkpermit.do',
                '档案管理': '/workflow/content_record.do'
            },
            'pid3': {
                '证明开具': '/workflow/content_certificate.do',
                '生育保险': '/workflow/content_hospital.do',
                '医疗保险': '/workflow/content_hospital.do',
                '住房公积金': '/workflow/content_accumulationfund.do'
            },
            'pid4': {
                '证明开具': '/workflow/content_certificate.do'
            },
            'pid5': {
                '证明开具': '/workflow/content_certificate.do'
            },
            'pid6': {
                '证明开具': '/workflow/content_certificate.do'
            },
            'pid7': {
                '证明开具': '/workflow/content_certificate.do'
            },
            'pid8': {
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '上海居住证积分': '/workflow/content_shworkpermit.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do',
                '双外住房补贴': '/workflow/content_subside.do'
            },
            'pid9': {
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '应届生落户': '/workflow/content_szgraduatesSettle.do',
                '工作居住证办理': '/workflow/content_szworkpermit.do',
                '社会保险': '/workflow/content_szbirthallowance.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do',
                '双外住房补贴': '/workflow/content_subside.do',
                '社招调户': '/workflow/content_szsettled.do'
            },
            'pid10': {
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do'
            },
            'pid11': {
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do'
            },
            'pid12': {
                '礼品卡/慰问金': '/workflow/content_welfarecard.do',
                '商业医疗保险': '/workflow/content_insurancefamily.do',
                '双外住房补贴': '/workflow/content_subside.do'
            },
            'pid14': {
                '证明开具': '/workflow/content_certificate.do'
            }
        };

        // return eval('map.pid'+portalInfoId+'.'+servicename);
        return map['pid' + portalInfoId][servicename];
    }

});