<?php

/* /src/block/common/btn-up/btn-up.html.twig */
class __TwigTemplate_f9ae7334731bb31de28c38e6e0fed8fcd7c22ecfb41f97f2a1d07290329c38d9 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<button class=\"b-btn-up\">";
        echo (isset($context["text"]) ? $context["text"] : null);
        echo "</button>
";
    }

    public function getTemplateName()
    {
        return "/src/block/common/btn-up/btn-up.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/btn-up/btn-up.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/btn-up/btn-up.html.twig");
    }
}
