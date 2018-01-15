<?php

/* /src/block/common/b-content/b-content.html.twig */
class __TwigTemplate_879d3407ff01f7db27d34029916cc8b41d325158f6b3a69998b916c4ef507562 extends Twig_Template
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
        echo "<div class=\"b-content-top\">
\t<div class=\"b-content-top__info\">
\t\t<h1>";
        // line 3
        echo (isset($context["title"]) ? $context["title"] : null);
        echo "</h1>
\t\t<p>
\t\t\t";
        // line 5
        echo (isset($context["description"]) ? $context["description"] : null);
        echo "
\t\t</p>
\t\t<a class=\"button orange upc b small radius js-question-btn\" data-form-type=\"js-analytic-top-cont-question\" href=\"#\"><span>задать вопрос</span></a>
\t</div>
\t<div class=\"b-content-top__img\" style=\"background-image: url(";
        // line 9
        echo (isset($context["img"]) ? $context["img"] : null);
        echo ");\"></div>
</div>
";
    }

    public function getTemplateName()
    {
        return "/src/block/common/b-content/b-content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  35 => 9,  28 => 5,  23 => 3,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/b-content/b-content.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/b-content/b-content.html.twig");
    }
}
